import {Id} from "../../database/type/id";
/**
 * Created by sushi on 06/05/17.
 */


export abstract class Character{

    // General
    _id:Id;
    name:string;
    level:number;
    life:number;

    // Characteristic
    resistance:number;
    strength:number;
    speed:number;
    vitality:number;

    constructor(){

    }
}