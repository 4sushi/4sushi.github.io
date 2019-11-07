import {MainDAO} from "./mainDAO";
import {Player} from "../model/character/player";
import PlayerDB, {IPlayerDB} from "../database/playerDB";
import {LOGGER} from "../server/logger";
import {Id} from "../database/type/id";
import {Monster} from "../model/character/monster";
import {IMonsterDB, default as MonsterDB} from "../database/monsterDB";

export class MonsterDAO extends MainDAO {

    public static async getById(_id:Id):Promise<Monster>{

        LOGGER.logParams("info", _id);

        let monsterDb:IMonsterDB;
        let monster:Monster;

        monsterDb = await MonsterDB.findOne({'_id' : _id}).exec();

        if (!monsterDb) {
            throw new Error('No data found');
        }

        monster = MonsterDAO.dbToObject(monsterDb);

        return monster;
    }

    public static async getMapByIds(_ids:Array<Id>):Promise<Map<Id,Monster>> {

        let monstersDb:IMonsterDB[];
        let monsters:Map<Id, Monster> = new Map();

        monstersDb = await MonsterDB.find({'_id' : {$in : _ids}}).exec();

        if (!monstersDb) {
            throw new Error('No data found');
        }

        for(let monsterDb of monstersDb){
            let monster:Monster= MonsterDAO.dbToObject(monsterDb);
            monsters.set(monster._id, monster);
        }

        return monsters;
    }

    // Return an array of monsters
    // If 2 same _id in input _ids, need two different monster in output
    public static async getArrayByIds(_ids:Array<Id>):Promise<Array<Monster>>{

        let monstersDb:IMonsterDB[];
        let monstersDBMap:Map<Id, IMonsterDB> = new Map();
        let monstersArray:Array<Monster> = [];

        monstersDb = await MonsterDB.find({'_id' : {$in : _ids}}).exec();

        if (!monstersDb) {
            throw new Error('No data found');
        }

        for(let monsterDb of monstersDb){
            monstersDBMap.set(monsterDb._id.toString(), monsterDb);
        }
        for(let id of _ids){
            let monsterDb:IMonsterDB = monstersDBMap.get(id);
            monstersArray.push(MonsterDAO.dbToObject(monsterDb));
        }

        return monstersArray;
    }



    private static dbToObject(json:IMonsterDB):Monster{

        let monster:Monster = new Monster();
        monster._id = json._id.toString();
        monster.name = json.name;
        monster.gold = json.gold;
        monster.xp = json.xp;
        // Characteristic
        monster.resistance = json.resistance;
        monster.strength = json.strength;
        monster.speed = json.speed;
        monster.vitality = json.vitality;
        return monster;
    }
}