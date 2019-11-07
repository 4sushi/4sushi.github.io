/**
 * Created by sushi on 31/05/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IPlayerDB extends mongoose.Document {
    _id: string;
    // General
    name: string;
    level: number;
    life: number;
    gold:number;
    xp:number;
    ap:number;
    // Cell
    cellKey:string;
    // Characteristic
    resistance: number;
    strength: number;
    speed: number;
    vitality: number;
    availablePoint:number;
    // Inventory
    _equipments: [{
        typeEq: string,
        _id: string
    }];
    _inventoryResources:[{
        _id: string,
        qt: number
    }];
    // Date
    dateEndFight:Date;
    dateWinLife:Date;
    dateWinAP:Date;
}

let PlayerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    // General
    name: String,
    level: Number,
    life: Number,
    gold:Number,
    xp:Number,
    ap:Number,
    // Map
    cellKey:String,
    // Characteristic
    resistance: Number,
    strength: Number,
    speed: Number,
    vitality: Number,
    availablePoint:Number,
    // Inventory
    _equipments: [{
        typeEq: String,
        _id: Schema.Types.ObjectId
    }],
    _inventoryResources:[{
        _id: Schema.Types.ObjectId,
        qt: Number
    }],
    // Date
    dateEndFight:Date,
    dateWinLife:Date,
    dateWinAP:Date
});

const PlayerDB = mongoose.model<IPlayerDB>('PlayerDB', PlayerSchema);
export default PlayerDB;