import {DataResponse} from "../dataResponse";

export class AttackResponse extends DataResponse{

    _visibleEquipmentsPlayer:Array<string>;
    fighters:Array<AttackResponseFighter> ;
    turns:Array<AttackResponseTurnTrace> ;
    eqWin:number;
    winXp:number;
    winGold:number;
    levelUp:boolean;
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

    attacks:Array<AttackResponseAttackTrace> = [];
}

class AttackResponseAttackTrace{

    strikes:Array<number> = [];
    iAttacker:number;
    iTarget:number;
    lifeTarget:number;
}
