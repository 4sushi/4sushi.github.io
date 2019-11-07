import {MainDAO} from "./mainDAO";
import {Shop} from "../model/world/shop";
import {EquipmentDAO} from "./equipmentDAO";
import {PotionDAO} from "./potionDAO";
import {LOGGER} from "../server/logger";
import {Id} from "../database/type/id";
import ShopDB, {IShopDB} from "../database/shopDB";
/**
 * Created by sushi on 18/12/17.
 */

export class ShopDAO extends MainDAO{

    public static async getAll():Promise<Map<Id,Shop>>{

        LOGGER.logParams("debug");

        let shopsDB:Array<IShopDB>;
        let shops:Map<Id,Shop> = new Map();

        shopsDB = await ShopDB.find().exec();

        for(let shopDB of shopsDB){
            let shop:Shop = ShopDAO.dbToObject(shopDB);
            shops.set(shop._id, shop);
        }

        return shops;
    }

    public static async getById(shopId:string):Promise<Shop>{

        LOGGER.logParams("debug", shopId);

        let shopDB:IShopDB;
        let shop:Shop;

        shopDB = await ShopDB.findOne({'_id' : shopId});

        shop = ShopDAO.dbToObject(shopDB);

        return shop;
    }

    private static dbToObject(json:IShopDB):Shop{

        if(json == null){
            return null;
        }

        let shop:Shop = new Shop();
        shop._id = json._id.toString();
        shop.name = json.name;
        shop._equipments = json._equipments;
        shop._potions = json._potions;

        return shop;
    }

}