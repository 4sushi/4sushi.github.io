/**
 * Created by sushi on 18/12/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {IEquipmentDB} from "./equipmentDB";
import {IPotionDB} from "./potionDB";

export interface IShopDB extends mongoose.Document {
    _id:string;
    name:string;
    cellKey:string;
    _equipments:Array<string>;
    _potions:Array<string>;
};

let ShopSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    cellKey:String,
    _equipments:[Schema.Types.ObjectId],
    _potions:[Schema.Types.ObjectId],
});

const ShopDB = mongoose.model<IShopDB>('ShopDB', ShopSchema);
export default ShopDB;