/**
 * Created by sushi on 14/12/17.
 */

import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IMonsterDB extends mongoose.Document {
    _id: string;
    // General
    name: string;
    gold:number;
    xp:number;
    pctAppearance:number,
    // Characteristic
    resistance: number;
    strength: number;
    speed: number;
    vitality: number;
}

let MonsterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    // General
    name: String,
    gold:Number,
    xp:Number,
    pctAppearance:Number,
    // Characteristic
    resistance: Number,
    strength: Number,
    speed: Number,
    vitality: Number
});

const MonsterDB = mongoose.model<IMonsterDB>('MonsterDB', MonsterSchema);
export default MonsterDB;