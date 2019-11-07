import {Fighter} from "../fighter";
/**
 * Created by sushi on 13/10/17.
 */

export class FighterReturn{

    _id:string;
    name:string;
    level:number;
    life:number;
    lifeMax:number;
    team:number; // 1 or 2

    constructor(fighter:Fighter){
        this.name = fighter.name;
        this.level = fighter.level;
        this.life = fighter.life;
        this.lifeMax = fighter.lifeMax;
        this._id = fighter._id;
    }
}