import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IAccountDB extends mongoose.Document {
    _id:string,
    email:string;
    password:string;
    _player:string;
};

let AccountSchema = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
    email:String,
    password:String,
    _player:Schema.Types.ObjectId
});

const AccountDB = mongoose.model<IAccountDB>('AccountDB', AccountSchema);
export default AccountDB;