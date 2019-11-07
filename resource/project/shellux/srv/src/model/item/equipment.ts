import {Item} from "./item";
export class Equipment extends Item{

    resistance:number;
    speed:number;
    strength:number;
    vitality:number;
    minLevel:number;
    type:string;

    constructor(){
        super();
    }
}