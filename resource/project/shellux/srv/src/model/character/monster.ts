import {Character} from "./character";
import {Id} from "../../database/type/id";
/**
 * Created by sushi on 06/05/17.
 */

export class Monster extends Character{

    // General
    _dropItems:Map<Id, number>; // Key : id item, value : tx drop
    gold:number;
    xp:number;

    constructor(){
        super();
    }

    assignLevel(level:number, levelMinArea:number, levelMaxArea:number){

        let ratio:number = (level / levelMinArea) ;
        this.level = level;
        this.xp = ~~(this.xp * ratio);
        this.gold = ~~(this.gold * ratio);
        this.resistance = ~~(this.resistance * ratio);
        this.speed = ~~(this.speed * ratio);
        this.strength = ~~(this.strength * ratio);
        this.vitality = ~~(this.vitality * ratio);
        this.life = 5 + (this.vitality * 3) + (level * 5);
    }
}