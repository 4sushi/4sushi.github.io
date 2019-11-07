import {Player} from "../character/player";
import {Monster} from "../character/monster";
import {Id} from "../../database/type/id";
import {DataBase} from "../../database/dataBase";
import {GroupMonster} from "./groupMonster";
import {Shop} from "./shop";
/**
 * Created by sushi on 06/05/17.
 */

export class Cell{

    x:number;
    y:number;

    _players:Array<Id>;
    groupMonsters:Map<Id, GroupMonster>;
    _area:Id;
    _shop:Id = null;

    constructor(cellKey:string){
        this.x = parseInt(cellKey.split(':')[0]);
        this.y = parseInt(cellKey.split(':')[1]);
        this._players = new Array();
        this.groupMonsters = new Map();
    }

    addGroupMonster(groupMonster:GroupMonster):string{
        this.groupMonsters.set(groupMonster._id, groupMonster);
        return groupMonster._id;
    }

    addPlayer(playerId:Id):void{

        this._players.push(playerId);
    }

    delPlayer(playerId:Id):void{
        let idx:number = this._players.indexOf(playerId);
        this._players.splice(idx,1);
    }

    getMonstersId():Array<Id>{

        let monstersId = new Array();

        for(let [id, group] of this.groupMonsters){
            for(let monsterId of group._monsters){
                if(monstersId.indexOf(monsterId) == -1){ // No exist
                    monstersId.push(monsterId);
                }
            }
        }

        return monstersId;
    }

    getKey():string{
        return Cell.generateKey(this.x, this.y);
    }

    static generateKey(x:number, y:number):string{
        return x + ':' + y;
    }
}