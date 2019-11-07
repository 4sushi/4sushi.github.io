import {Player} from "../model/character/player";
import {World} from "../model/world/world";
import {Id} from "../database/type/id";
import {Cell} from "../model/world/cell";
import {Area} from "../model/world/area";
import {AreaDAO} from "../dao/areaDAO";
import {CellDAO} from "../dao/cellDAO";
import {Shop} from "../model/world/shop";
import {ShopDAO} from "../dao/shopDAO";

/**
 * Created by sushi on 09/06/17.
 */

class Data{

    private world:World;
    private cells:Map<string,Cell>; // Key cellKey - value cell
    private areas:Map<Id,Area>;
    private players:Map<Id, Player> = new Map();
    private shops:Map<Id, Shop> ;

    constructor(){
        this.world = new World();
    }

    /**
     * Load data to memory
     * @returns {null}
     */
    async init():Promise<void>{

        this.areas = await AreaDAO.getAll();
        this.cells = await CellDAO.getAll();
        this.shops = await ShopDAO.getAll();
        this.world.initWorld(this.cells, this.areas);
    }

    getPlayer(playerId:Id):Player{
        return this.players.get(playerId);
    }

    getPlayers(playersId:Array<Id>):Array<Player>{
        let players:Array<Player> = [];
        for(let playerId of playersId){
            if(this.players.has(playerId)){
                players.push(this.players.get(playerId));
            }
        }
        return players;
    }

    addPlayer(player:Player):void{
        this.players.set(player._id, player);
    }

    delPlayer(playerId:Id):void{
        this.players.delete(playerId);
    }

    getCell(cellId:Id):Cell{
        return this.cells.get(cellId);
    }

    getArea(areaId:Id):Area{
        return this.areas.get(areaId);
    }

    getShop(shopId:Id):Shop{
        return this.shops.get(shopId);
    }

    getWorld():World{
        return this.world;
    }
}

const DATA = new Data();
export default DATA;