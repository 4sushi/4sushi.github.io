import {DataResponse} from "../dataResponse";

export class WorldResponse extends DataResponse{

    players:Array<WorldResponsePlayer> = new Array();
    groupMonsters:Array<WorldResponseGroupMonster> = new Array();
    shop:WorldResponseShop = new WorldResponseShop();
}

export class WorldResponsePlayer{
    _id:string;
    _visibleEquipments:Array<string> = new Array();
    name:string;
    level:number;
    inFight:boolean;
}

export class WorldResponseGroupMonster{
    _id:string;
    _monsters:Array<string> ;
    levels:Array<number>;
}
export class WorldResponseShop{
    _id:string;
    _potions:Array<string> = new Array();
    _equipments:Array<string> = new Array();
    name:string;
}