
import {MainDAO} from "./mainDAO";
import {Area} from "../model/world/area";
import {LOGGER} from "../server/logger";
import {Id} from "../database/type/id";
import {default as AreaDB, IAreaDB} from "../database/areaDB";
import {Cell} from "../model/world/cell";
import {DataBase} from "../database/dataBase";
/**
 * Created by sushi on 16/12/17.
 */


export class AreaDAO extends MainDAO{


    public static async getAll():Promise<Map<Id,Area>>{

        LOGGER.logParams("debug");

        let areasDB:Array<IAreaDB>;
        let areas:Map<Id,Area> = new Map();

        areasDB = await AreaDB.find().populate('_monsters').exec();
        LOGGER.logJSON("debug", areasDB);

        for(let areaDB of areasDB){
            let area:Area = AreaDAO.dbToObject(areaDB);
            areas.set(area._id, area);
        }

        return areas;
    }

    private static dbToObject(json:IAreaDB):Area{

        if(json == null){
            return null;
        }

        let area:Area = new Area();
        area._id = json._id.toString();
        area.name = json.name;
        area.icon = json.icon;
        area.levelMinMonster = json.levelMinMonster;
        area.levelMaxMonster = json.levelMaxMonster;

        // Maps

        for(let monster of json._monsters){
            area._monsters.set(monster._id.toString(), monster.pctAppearance);
        }


        return area;
    }

}