import {DataResponse} from "../dataResponse";
/**
 * Created by sushi on 08/05/17.
 */

export class KillResponse extends DataResponse{

    _visibleEquipmentsPlayer1:Array<string> = new Array();
    _visibleEquipmentsPlayer2:Array<string> = new Array();
    fighters:Array<AttackResponseFighter> = new Array();
    turns:Array<AttackResponseTurnTrace> = new Array();
    eqWin:number;


    constructor(fighters: Array<AttackResponseFighter>, turns: Array<AttackResponseTurnTrace>, eqWin: number) {
        super();
        this.fighters = fighters;
        this.turns = turns;
        this.eqWin = eqWin;
    }
}

class AttackResponseFighter{
    _id:string;
    name:string;
    level:number;
    life:number;
    lifeMax:number;
    team:number; // 1 or 2
}

class AttackResponseTurnTrace{

    attacks:Array<AttackResponseAttackTrace> = new Array();
}

class AttackResponseAttackTrace{

    strikes:Array<number> = new Array();
    iAttacker:number;
    iTarget:number;
    lifeTarget:number;
}
