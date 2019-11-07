/**
 * Created by sushi on 06/05/17.
 */


import {Id} from "../../database/type/id";

export abstract class Item{

    _id:Id;
    name:string;
    sellPrice:number;

    constructor(){

    }
}