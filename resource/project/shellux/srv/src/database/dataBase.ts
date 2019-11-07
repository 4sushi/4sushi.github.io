import * as mongoose from "mongoose";
/**
 * Created by sushi on 21/05/17.
 */

export class DataBase{

    public connection:mongoose.Connection;
    private url:string = 'mongodb://localhost/';
    private port:string;
    private name:string = "shellux";

    async connect():Promise<void>{
        (mongoose as any).Promise = global.Promise; // (mongoose as any).Promise = require('bluebird');
        await mongoose.connect(this.url + this.name);
        this.connection = mongoose.connection;
    }


    static generateId():string{
        return mongoose.Types.ObjectId().toHexString();
    }


}

const DATABASE = new DataBase();
export default DATABASE;