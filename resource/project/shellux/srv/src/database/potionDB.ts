/**
 * Created by sushi on 18/12/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IPotionDB extends mongoose.Document {
    _id:string;
    name:string;
    sellPrice:number;
    life:number;
};

let PotionSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    sellPrice:Number,
    life:Number
});

const PotionDB = mongoose.model<IPotionDB>('PotionDB', PotionSchema);
export default PotionDB;