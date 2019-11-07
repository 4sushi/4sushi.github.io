import {Id} from "../../database/type/id";
/**
 * Created by sushi on 16/12/17.
 */

export class GroupMonster{
    _id:Id;
    _monsters:Array<Id> = new Array();
    levels:Array<number> =  new Array() ; // Level of monsters, same index that monsters array
}