import {Id} from "../../database/type/id";
/**
 * Created by sushi on 19/09/17.
 */

export class Fighter{


    _id:Id; // Id player or monster
    name:string;

    life:number;
    lifeMax:number;
    level:number;
    agility:number;
    resistance:number;
    strength:number;
    speed:number;
    vitality:number;


    constructor(){

    }

    attack(target:Fighter):Array<number>{

        let attacksTrace:Array<number> = new Array();

        let nbAttack:number = Math.floor( (this.speed )  / (target.speed + 20));
        if(nbAttack < 1){
            nbAttack = 1;
        }

        for(var i = 0; i < nbAttack; i++){
            let damageSuffered:number = this.strike(target);
            attacksTrace.push(-damageSuffered);
        }

        return attacksTrace;
    }

    private strike(target:Fighter):number{

        // Damage inflicted

        let damageInflicted:number = 3 + this.strength/ 5;

        // Damage suffered

        let damageSuffered:number = damageInflicted - (target.resistance / 10);
        if(damageSuffered < 1){
            damageSuffered = 1;
        }else{
            damageSuffered = Math.round(damageSuffered);
        }

        target.life -= damageSuffered;
        if(target.life < 0){
            target.life = 0;
        }

        return damageSuffered;
    }

    private getRandomBeteween(min:number, max:number):number{
        return Math.floor(Math.random() * max) + min;
    }

}