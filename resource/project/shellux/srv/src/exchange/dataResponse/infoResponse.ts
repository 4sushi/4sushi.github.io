import {DataResponse} from "../dataResponse";

export class InfoResponse extends DataResponse{

    life:number;
    lifeMax:number;
    xp:number;
    xpMax:number;
    gold:number;
    ap:number;
    level:number;

    // Characteristic
    resistance:number;
    strength:number;
    speed:number;
    vitality:number;

    // Bonus equipment
    resistanceE:number;
    strengthE:number;
    speedE:number;
    vitalityE:number;

    availablePoint:number;
}