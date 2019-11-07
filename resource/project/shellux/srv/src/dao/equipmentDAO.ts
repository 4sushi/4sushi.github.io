/**
 * Created by sushi on 17/09/17.
 */

import {MainDAO} from "./mainDAO";
import {LOGGER} from "../server/logger";
import {Equipment} from "../model/item/equipment";
import {Id} from "../database/type/id";
import {Monster} from "../model/character/monster";
import {default as EquipmentDB, IEquipmentDB} from "../database/equipmentDB";

export class EquipmentDAO extends MainDAO{


    public static async getById(equipmentId:string):Promise<Equipment>{

        LOGGER.logParams("debug", equipmentId);

        let equipmentDB:IEquipmentDB;
        let equipment:Equipment;

        equipmentDB = await EquipmentDB.findOne({'_id' : equipmentId});

        equipment = EquipmentDAO.dbToObject(equipmentDB);

        return equipment;
    }

    public static async getMapByIds(_ids:Array<Id>):Promise<Map<Id,Equipment>> {

        let equipmentsDB:IEquipmentDB[];
        let equipments:Map<Id, Equipment> = new Map();

        equipmentsDB = await EquipmentDB.find({'_id' : {$in : _ids}}).exec();

        if (!equipmentsDB) {
            throw new Error('No data found');
        }

        for(let equipmentDB of equipmentsDB){
            let equipment:Equipment= EquipmentDAO.dbToObject(equipmentDB);
            equipments.set(equipment._id, equipment);
        }

        return equipments;
    }

    public static objectToDB(equipment:Equipment):IEquipmentDB{

        let equipmentDB:any = {
            _id : equipment._id,
            name : equipment.name,
            sellPrice : equipment.sellPrice,
            resistance : equipment.resistance,
            speed : equipment.speed,
            vitality : equipment.vitality,
            strength : equipment.strength,
            minLevel : equipment.minLevel,
            type : equipment.type
        };

        return equipmentDB;
    }

    public static dbToObject(json:IEquipmentDB):Equipment{

        if(json == null){
            return null;
        }

        let equipment:Equipment = new Equipment();
        equipment._id = json._id.toString();
        equipment.name = json.name;
        equipment.sellPrice = json.sellPrice;
        equipment.resistance = json.resistance;
        equipment.speed = json.speed;
        equipment.vitality = json.vitality;
        equipment.strength = json.strength;
        equipment.minLevel = json.minLevel;
        equipment.type = json.type;

        return equipment;
    }

}