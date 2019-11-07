import {Fighter} from "../fighter";
import {FighterReturn} from "./fighterReturn";
import {TurnTrace} from "./turnTrace";

export class FightKillReturn {

    fighters:Array<FighterReturn> = new Array();
    turns:Array<TurnTrace> = new Array();
    eqWin:number;

    addFighters(player1:Fighter, player2:Fighter):void{

        // Equip 1
        let eq1:FighterReturn = new FighterReturn(player1);
        eq1.team = 1;
        this.fighters.push(eq1);

        // Equip 2
        let eq2:FighterReturn = new FighterReturn(player2);
        eq2.team = 1;
        this.fighters.push(eq2);
    }

}
