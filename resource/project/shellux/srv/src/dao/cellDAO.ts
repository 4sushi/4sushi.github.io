import {Id} from "../database/type/id";
import {Cell} from "../model/world/cell";
import {LOGGER} from "../server/logger";
import {default as AreaDB, IAreaDB} from "../database/areaDB";
import ShopDB, {IShopDB} from "../database/shopDB";
/**
 * Created by sushi on 18/12/17.
 */


export class CellDAO{

    public static async getAll():Promise<Map<Id,Cell>>{

        LOGGER.logParams("debug");

        let areasDB:Array<IAreaDB>;
        let shopsDB:Array<IShopDB>;
        let cells:Map<Id,Cell> = new Map();

        areasDB = await AreaDB.find().exec();

        for(let areaDB of areasDB){
            for(let cellKey of areaDB.cellsKey){
                let cell:Cell = new Cell(cellKey);
                cell._area = areaDB._id.toString();
                cells.set(cell.getKey(), cell);
            }
        }

        shopsDB = await ShopDB.find().exec();

        for(let shopDB of shopsDB){
            let cell:Cell = cells.get(shopDB.cellKey);
            cell._shop = shopDB._id.toString();
        }

        return cells;
    }

}