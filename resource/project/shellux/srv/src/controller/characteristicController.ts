import {GameServer} from "../server/gameServer";
import {CharacteristicService} from "../service/characteristicService";
import {IncreaseResponse} from "../exchange/dataResponse/increaseResponse";
import {LOGGER} from "../server/logger";
import {RequestGame} from "../exchange/requestGame";
import {CmdParamTypeError} from "../util/error/cmdParamTypeError";
import {InfoResponse} from "../exchange/dataResponse/infoResponse";


export class CharacteristicController {

    server: GameServer;
    characteristicService: CharacteristicService;


    constructor(server: GameServer) {

        this.server = server;
        this.characteristicService = new CharacteristicService(server);
    }

    async info(req:RequestGame):Promise<InfoResponse>{

        LOGGER.logParams('debug', req.params[0]);

        let resp:InfoResponse;
        resp = await this.characteristicService.info(req.profile);

        return resp;
    }

    async increase(req:RequestGame):Promise<IncreaseResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1], req.params[2]);

        let characteristicName:string =  req.params[1];
        let point:number = parseInt(req.params[2]);

        if(isNaN(point)){
            throw new CmdParamTypeError;
        }

        let resp:IncreaseResponse;
        resp = await this.characteristicService.increase(characteristicName, point, req.profile);

        return resp;
    }

}
