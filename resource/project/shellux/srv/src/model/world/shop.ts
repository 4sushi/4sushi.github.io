import {Id} from "../../database/type/id";
import {Equipment} from "../item/equipment";
import {Potion} from "../item/potion";
/**
 * Created by sushi on 18/12/17.
 */

export class Shop{

    _id:Id;
    name:string;
    _equipments:Array<Id> = new Array();
    _potions:Array<Id> = new Array();
}