import {Notification} from "../notification";

export class NotificationStartFight extends Notification{

    visibleEquipmentsIdPlayer1:Array<string> = new Array();
    visibleEquipmentsIdPlayer2:Array<string> = new Array();
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
