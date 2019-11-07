/**
 * Created by sushi on 18/12/17.
 */

import {MainDAO} from "./mainDAO";
import {LOGGER} from "../server/logger";
import {Potion} from "../model/item/potion";
import {Id} from "../database/type/id";
import {IPotionDB, default as PotionDB} from "../database/potionDB";

export class PotionDAO extends MainDAO{

    public static async getById(potionId:string):Promise<Potion>{

        LOGGER.logParams("debug", potionId);

        let potionDB:IPotionDB;
        let potion:Potion;

        potionDB = await PotionDB.findOne({'_id' : potionId});

        potion = PotionDAO.dbToObject(potionDB);

        return potion;
    }

    public static async getMapByIds(_ids:Array<Id>):Promise<Map<Id,Potion>> {

        let potionsDB:IPotionDB[];
        let potions:Map<Id, Potion> = new Map();

        potionsDB = await PotionDB.find({'_id' : {$in : _ids}}).exec();

        if (!potionsDB) {
            throw new Error('No data found');
        }

        for(let potionDB of potionsDB){
            let potion:Potion= PotionDAO.dbToObject(potionDB);
            potions.set(potion._id, potion);
        }

        return potions;
    }

    public static objectToDB(potion:Potion):IPotionDB{

        let potionDB:any = {
            _id : potion._id,
            name : potion.name,
            sellPrice : potion.sellPrice,
            life : potion.life
        };

        return potionDB;
    }

    public static dbToObject(json:IPotionDB):Potion{

        if(json == null){
            return null;
        }

        let potion:Potion = new Potion();
        potion._id = json._id.toString();
        potion.name = json.name;
        potion.sellPrice = json.sellPrice;
        potion.life = json.life;

        return potion;
    }

}