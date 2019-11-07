/**
 * Created by sushi on 17/09/17.
 */

/**
 * Created by sushi on 17/09/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IEquipmentDB extends mongoose.Document {
    _id:string,
    name:string;
    sellPrice:number;
    resistance:number;
    speed:number;
    vitality:number;
    strength:number;
    minLevel:number;
    type:string;
};

let EquipmentSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    sellPrice:Number,
    resistance:Number,
    speed:Number,
    vitality:Number,
    strength:Number,
    minLevel:Number,
    type:String
});

const EquipmentDB = mongoose.model<IEquipmentDB>('EquipmentDB', EquipmentSchema);
export default EquipmentDB;