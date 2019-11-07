import {GameServer} from "../../../src/server/gameServer";
import {Connection} from "mongoose";
import DATABASE from "../../../src/database/dataBase";
/**
 * Created by sushi on 09/05/17.
 */

/**
 * Main Integration Test
 * - run server
 * - insert/update/delete dataset in database before and after test
 */
export class MainIT{

    server:GameServer;
    db:Connection;

    listInsertBeforeDataSet:InsertDataSet[] = [] ;
    listDeleteAfterDataSet:DeleteDataSet[] = [];

    /**
     * Init server
     */
    constructor(){
        this.server = new GameServer();
    }

    /**
     * Run server
     * @returns {Promise<void>}
     */
    async init():Promise<void>{
        await this.server.run();
        this.db = DATABASE.connection;
    }

    /**
     * Insert dataset before tests
     * @returns {Promise<void>}
     */
    async insertBeforeDataSet():Promise<void>{
        for(let insert of this.listInsertBeforeDataSet){
            await this.db.collection(insert.collection + "dbs").insertOne(insert.document);
        }
    }

    /**
     * Delete dataset after tests
     * @returns {Promise<void>}
     */
    async deleteAfterDataSet():Promise<void>{
        for(let del of this.listDeleteAfterDataSet){
            await this.db.collection(del.collection + "dbs").deleteOne(del.where);
        }
    }

    /**
     * push element in listInsertBeforeDataSet
     * @param collection
     * @param document
     */
    addInsertBeforeDataSet(collection:string, document:Object):void{
        this.listInsertBeforeDataSet.push(new InsertDataSet(collection, document));
    }

    /**
     * push element in listDeleteAfterDataSet
     * @param collection
     * @param where
     */
    addDeleteAfterDataSet(collection:string, where:Object):void{
        this.listDeleteAfterDataSet.push(new DeleteDataSet(collection, where));
    }
}

/**
 * Data Requirements for run request insert on mongoDb
 */
class InsertDataSet{
    collection:string;
    document:Object;

    constructor(collection:string, document:Object){
        this.collection = collection;
        this.document = document;
    }
}

/**
 * Data Requirements for run request delete on mongoDb
 */
class DeleteDataSet{
    collection:string;
    where:Object;

    constructor(collection:string, where:Object){
        this.collection = collection;
        this.where = where;
    }
}