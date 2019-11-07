import {FighterReturn} from "./fighterReturn";
import {Fighter} from "../fighter";
import {TurnTrace} from "./turnTrace";
/**
 * Created by sushi on 13/10/17.
 */

export class FightAttackReturn {

    fighters:Array<FighterReturn> = new Array();
    turns:Array<TurnTrace> = new Array();
    eqWin:number;
    winXp:number;
    winGold:number;
    levelUp:boolean;

    addFighters(player:Fighter, monsters:Array<Fighter>):void{

        // Equip 1
        let eq1:FighterReturn = new FighterReturn(player);
        eq1.team = 1;
        this.fighters.push(eq1);

        // Equip 2
        for(let monster of monsters){
            let eq2:FighterReturn = new FighterReturn(monster);
            eq2.team = 2;
            this.fighters.push(eq2);
        }
    }

}

