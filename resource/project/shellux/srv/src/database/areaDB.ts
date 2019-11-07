/**
 * Created by sushi on 16/12/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {IMonsterDB} from "./monsterDB";

export interface IAreaDB extends mongoose.Document {
    _id:string,
    name:string;
    icon:string;
    _monsters:[IMonsterDB];
    cellsKey:Array<string>;
    levelMinMonster:number;
    levelMaxMonster:number;
};

let AreaSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    icon:String,
    _monsters:[{ type: Schema.Types.ObjectId, ref: 'MonsterDB' }],
    cellsKey:[],
    levelMinMonster:Number,
    levelMaxMonster:Number
});

const AreaDB = mongoose.model<IAreaDB>('AreaDB', AreaSchema);
export default AreaDB;