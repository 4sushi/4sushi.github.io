import {Id} from "../../database/type/id";
import {Monster} from "../character/monster";
import {GroupMonster} from "./groupMonster";
import {DataBase} from "../../database/dataBase";
import {LOGGER} from "../../server/logger";
/**
 * Created by sushi on 16/12/17.
 */

export class Area{

    _id:Id;
    name:string;
    icon:string;
    // key : id monster - value : pct apparition
    _monsters:Map<Id, number>;
    levelMinMonster:number;
    levelMaxMonster:number;

    constructor(){
        this._monsters = new Map();
    }

    // Generate new group monster (id) to add on the cell
    getNewGroupMonster():GroupMonster{

        let groupMonster:GroupMonster = new GroupMonster();
        groupMonster._id = DataBase.generateId();

        let nbMonster:number = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

        for(let i = 0; i < nbMonster; i++){
            let monsterId:Id = this.getRandomMonsterId();
            let randomLevel:number = Math.floor(Math.random() * (this.levelMaxMonster - this.levelMinMonster + 1)) + this.levelMinMonster;
            groupMonster._monsters.push(monsterId);
            groupMonster.levels.push(randomLevel);
        }

        return groupMonster;
    }


    private getRandomMonsterId():Id{

        let randomPct:number = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        let sumPct:number = 0;

        for(let [id, pctAppearance] of this._monsters){
            sumPct += pctAppearance;
            if(randomPct <= sumPct){
                return id;
            }
        }

        LOGGER.error("getRandomMonsterId - sum pctAppearance no equal 100%")
        throw Error();
    }
}