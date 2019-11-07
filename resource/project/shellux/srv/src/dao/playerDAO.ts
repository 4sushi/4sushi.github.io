import {MainDAO} from "./mainDAO";
import {Player} from "../model/character/player";
import PlayerDB, {IPlayerDB} from "../database/playerDB";
import {LOGGER} from "../server/logger";
import {Id} from "../database/type/id";
import {EquipmentDAO} from "./equipmentDAO";
import {Equipment} from "../model/item/equipment";

/**
 * Created by sushi on 31/05/17.
 */

export class PlayerDAO extends MainDAO {

    public static async isAvailableName(name:string):Promise<boolean>{

        LOGGER.logParams("info", name);

        let nb:number = await PlayerDB.count({name : name}).exec();
        return nb == 0;

    }

    public static async getById(_id:Id):Promise<Player>{

        LOGGER.logParams("info", _id);

        let playerDb:IPlayerDB;
        let player:Player;

        playerDb = await PlayerDB.findOne({'_id' : _id}).populate('_equipments').exec();

        if (!playerDb) {
            throw new Error('No data found');
        }

        player = PlayerDAO.dbToObject(playerDb);
        await PlayerDAO.setBonusEquipments(player);

        return player;
    }

    public static async save(player:Player):Promise<string>{

        let json:IPlayerDB = PlayerDAO.objectToDB(player);
        // let playerDb:IPlayerDB = new PlayerDB(json);

        await PlayerDB.update({_id: json._id}, json, {upsert: true, setDefaultsOnInsert: true}).exec();

        return json._id;

    }

    private static async setBonusEquipments(player:Player):Promise<void>{
        let equipmentsId:Array<Id> = Array.from(player._equipments.values());
        let equipments:Map<Id, Equipment> = await EquipmentDAO.getMapByIds(equipmentsId);
        for(let [key, equipment] of equipments){
            player.resistanceE += equipment.resistance;
            player.speedE += equipment.speed;
            player.strengthE += equipment.strength;
            player.vitalityE += equipment.vitality;
        }
    }

    private static objectToDB(player:Player):IPlayerDB{

        let playerDb:any = {
            _id : player._id,
            name: player.name,
            level: player.level,
            life: player.life,
            gold:player.gold,
            xp:player.xp,
            ap:player.ap,
            // Cell
            cellKey : player.cellKey,
            // Characteristic
            resistance:player.resistance,
            strength:player.strength,
            speed:player.speed,
            vitality:player.vitality,
            availablePoint:player.availablePoint,
            _equipments:[],
            _inventoryResources:[],
            // Date
            dateEndFight:player.dateEndFight,
            dateWinAP:player.dateWinAP,
            dateWinLife:player.dateWinLife
        };

        // Maps

        for(let [key, equipmentId] of player._equipments)
            playerDb._equipments.push({typeEq : key, _id : equipmentId});

        for(let [key, qt] of player._potions)
            playerDb._inventoryResources.push({_id : key, qt : qt});

        return playerDb;
    }

    private static dbToObject(json:IPlayerDB):Player{

        let player:Player = new Player();
        player._id = json._id.toString();
        player.name = json.name;
        player.level = json.level;
        player.life = json.life;
        player.gold = json.gold;
        player.xp = json.xp;
        player.ap = json.ap;
        // Cell
        player.cellKey = json.cellKey;
        // Characteristic
        player.resistance = json.resistance;
        player.strength = json.strength;
        player.speed = json.speed;
        player.vitality = json.vitality;
        player.availablePoint = json.availablePoint;
        // Inventory
        for(let ele of json._equipments){
            player._equipments.set(ele.typeEq, ele._id.toString());
        }
        for(let ele of json._inventoryResources){
            player._potions.set(ele._id.toString(), ele.qt);
        }
        // Date
        player.dateEndFight = json.dateEndFight;
        player.dateWinAP = json.dateWinAP;
        player.dateWinLife = json.dateWinLife;
        return player;
    }
}