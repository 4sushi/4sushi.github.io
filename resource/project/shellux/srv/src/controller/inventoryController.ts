import {GameServer} from "../server/gameServer";
import {InventoryService} from "../service/inventoryService";
import {InventoryResponse} from "../exchange/dataResponse/inventoryReponse";
import {UseResponse} from "../exchange/dataResponse/useResponse";
import {LOGGER} from "../server/logger";
import {RequestGame} from "../exchange/requestGame";
import {CmdParamTypeError} from "../util/error/cmdParamTypeError";

export class InventoryController{

    server:GameServer;
    inventoryService:InventoryService;


    constructor(server:GameServer){

        this.server = server;
        this.inventoryService = new InventoryService(server);
    }

    async inventory(req:RequestGame):Promise<InventoryResponse>{

        LOGGER.logParams('debug', req.params[0]);

        let response:InventoryResponse;

        response = await this.inventoryService.inventory(req.profile);

        return response;
    }

    async use(req:RequestGame):Promise<UseResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1], req.params[2]);

        let response:UseResponse;
        let potionId:string = req.params[1];
        let qt:number = parseInt(req.params[2]);

        if(isNaN(qt)){
            throw new CmdParamTypeError;
        }

        response = await this.inventoryService.use(potionId, qt, req.profile);

        return response;
    }

}
