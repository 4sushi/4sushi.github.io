import {GameServer} from "../server/gameServer";
import {WorldService} from "../service/worldService";
import {WorldResponse} from "../exchange/dataResponse/worldResponse";
import {MoveResponse} from "../exchange/dataResponse/moveResponse";
import {LOGGER} from "../server/logger";
import {RequestGame} from "../exchange/requestGame";
import {AttackResponse} from "../exchange/dataResponse/attackResponse";
import {MapResponse} from "../exchange/dataResponse/mapResponse";
import {BuyResponse} from "../exchange/dataResponse/buyResponse";
import {CmdParamTypeError} from "../util/error/cmdParamTypeError";
import {KillResponse} from "../exchange/dataResponse/killResponse";
import {SayResponse} from "../exchange/dataResponse/sayResponse";

export class WorldController{

    server:GameServer;
    worldService:WorldService;


    constructor(server:GameServer){

        this.server = server;
        this.worldService = new WorldService(server);
    }

    async attack(req:RequestGame):Promise<AttackResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1]);

        let response:AttackResponse;
        let groupId:string = req.params[1];

        response = await this.worldService.attack(groupId, req.profile);

        return response;
    }

    async buy(req:RequestGame):Promise<BuyResponse>{

        if(req.params.length == 2){
            req.params[2] = "1";
        }

        LOGGER.logParams('debug', req.params[0], req.params[1], req.params[2]);

        let response:BuyResponse;
        let itemId:string = req.params[1];
        let qt:number = parseInt(req.params[2]);

        if(isNaN(qt)){
            throw new CmdParamTypeError;
        }

        response = await this.worldService.buy(itemId, qt, req.profile);

        return response;
    }

    async kill(req:RequestGame):Promise<KillResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1]);

        let response:KillResponse;
        let playerId:string = req.params[1];

        response = await this.worldService.kill(playerId, req.profile);

        return response;
    }

    async map(req:RequestGame):Promise<MapResponse>{

        LOGGER.logParams('debug', req.params[0]);

        let response:MapResponse;

        response = await this.worldService.map(req.profile);

        return response;
    }

    async move(req:RequestGame):Promise<MoveResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1]);

        let response:MoveResponse;
        let direction:string = req.params[1];

        response = await this.worldService.move(direction, req.profile);

        return response;
    }

    async say(req:RequestGame):Promise<SayResponse>{

        LOGGER.logParams('debug', req.params[0], );

        let response:SayResponse;
        let message:string = req.params.slice(1).join(' ');

        response = await this.worldService.say(message, req.profile);

        return response;
    }

    async world(req:RequestGame):Promise<WorldResponse>{

        LOGGER.logParams('debug', req.params[0]);

        let response:WorldResponse;

        response = await this.worldService.world(req.profile);

        return response;
    }

}
