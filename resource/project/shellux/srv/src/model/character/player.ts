import {Character} from "./character";
import {Enum} from "../../util/enum/enum";
import {GlobalError} from "../../util/error/globalError";
import {Equipment} from "../item/equipment";
import {Id} from "../../database/type/id";
import {World} from "../world/world";
import {Potion} from "../item/potion";

export class Player extends Character{

    // Account
    _account:Id;

    // General
    gold:number;
    xp:number;
    ap:number;

    // Characteristic
    availablePoint:number;

    // Bonus equipment
    resistanceE:number = 0;
    strengthE:number = 0;
    speedE:number = 0;
    vitalityE:number = 0;

    // Inventory
    _equipments:Map<string, Id>;
    _potions:Map<Id, number>;

    // Cell
    cellKey:string;

    // profile
    _profile:Id = null;

    // Dates
    dateEndFight:Date;
    dateWinLife:Date;
    dateWinAP:Date;

    constructor(){
        super();
        this._equipments = new Map();
        this._potions = new Map();
    }

    setDefault():void{
        // General
        this.gold = 0;
        this.xp = 0;
        this.level = 1;
        this.life = 50;
        this.ap = 500;
        // Characteristic
        this.resistance = 0;
        this.strength = 0;
        this.speed = 0;
        this.vitality = 0;
        this.availablePoint = 0;
        // Bonus equipment
        this.resistanceE = 0;
        this.strengthE = 0;
        this.speedE = 0;
        this.vitalityE = 0;
        // Map
        this.cellKey = World.getCellKeyStart();
        // Date
        this.dateEndFight = new Date();
        this.dateWinLife = new Date();
        this.dateWinAP = new Date();
    }

    getLifeMax():number{
        return 40 + (this.vitality +this.vitalityE) * 3;
    }

    getXpMax(){
        return this.level * 500;
    }

    winXp(xpFight:number):boolean{
        let levelUp:boolean = false;
        let newXp:number = this.xp + xpFight;
        if(newXp > this.getXpMax()){
            this.xp = newXp - this.getXpMax();
            this.level++;
            this.availablePoint += 5;
            this.life = this.getLifeMax();
            levelUp = true;
        }
        else{
            this.xp = newXp;
        }
        return levelUp;
    }

    refresh():void{
        let now:number = new Date().getTime();
        // Each 12 minutes => +1 AP
        let winAp:number = Math.floor((now - this.dateWinAP.getTime()) / (1000 * 60 * 12)) ;
        // Each 1 sec => +1 AP
        let winLife:number = Math.floor((now - this.dateWinLife.getTime())/ 1000);
        if(winAp > 0 ){
            let winApRestMs:number = (now - this.dateWinAP.getTime()) % (1000 * 60 * 12);
            this.dateWinAP =  new Date(now - winApRestMs);
            this.ap = (this.ap+ winAp < 500) ? (this.ap+ winAp) : 500;
        }
        if(winLife > 0){
            let winLifeRestMs = (now - this.dateWinLife.getTime()) % (1000);
            this.dateWinLife =  new Date(now - winLifeRestMs);
            this.life = (this.life+ winLife < this.getLifeMax()) ? (this.life+ winLife) : this.getLifeMax();
        }
    }

    unequip(equipment:Equipment):void{
        // delete from equipment
        this._equipments.delete(equipment.type);
        // Refresh bonus equipment
        this.resistanceE -= equipment.resistance;
        this.strengthE -= equipment.strength;
        this.speedE -= equipment.speed;
        this.vitalityE -= equipment.vitality;
    }

    equip(equipment:Equipment):void{
        // Equip
        this._equipments.set(equipment.type, equipment._id);
        // Refresh bonus equipment
        this.resistanceE += equipment.resistance;
        this.strengthE += equipment.strength;
        this.speedE += equipment.speed;
        this.vitalityE += equipment.vitality;
    }

    increaseCharacteristic(characteristic:string, point:number):number{
        switch(characteristic){
            case Enum.CHARACTERISTIC.RESISTANCE :
                this.resistance += point;
                break;
            case Enum.CHARACTERISTIC.SPEED :
                this.speed+= point;
                break;
            case Enum.CHARACTERISTIC.STRENGTH :
                this.strength += point;
                break;
            case Enum.CHARACTERISTIC.VITALITY :
                this.vitality+= point;
                break;
        }
        this.availablePoint -= point;
        return this.availablePoint;
    }

    isInFight():boolean{
        return this.dateEndFight > new Date();
    }

    addPotion(potionId:string, qt:number){
        if(this._potions.has(potionId)){
            qt = this._potions.get(potionId) + qt;
            this._potions.set(potionId, qt);
        }
        else{
            this._potions.set(potionId, qt);
        }
    }

    usePotion(potion:Potion, qtUse:number):number{
        // Remove inventory
        let qt:number = this._potions.get(potion._id) - qtUse;
        if(qt > 0){
            this._potions.set(potion._id, qt);
        }
        else{
            this._potions.delete(potion._id);
        }
        // win life
        let potionLife:number = potion.life * qtUse;
        let winLife:number;
        if(this.life + potionLife > this.getLifeMax()){
            this.life = this.getLifeMax();
            winLife = this.getLifeMax() - this.life;
        }else{
            this.life += potionLife;
            winLife = potionLife;
        }
        return winLife;
    }

    getVisibleEquipmentsId():Array<Id>{
        let visibleEquipments:Array<Id> = [];
        for(let [type, eqId] of this._equipments){
            if([Enum.EQUIPMENT_TYPES.ARMOR, Enum.EQUIPMENT_TYPES.PANTS,
                    Enum.EQUIPMENT_TYPES.HELMET].indexOf(type) != -1){
                visibleEquipments.push(eqId);
            }
        }
        return visibleEquipments;
    }
}