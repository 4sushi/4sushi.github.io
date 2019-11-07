/**
 * Created by sushi on 06/05/17.
 */

import { GameServer } from '../server/gameServer' ;
import {IncreaseResponse} from "../exchange/dataResponse/increaseResponse";
import {LOGGER} from "../server/logger";
import {Profile} from "../server/profile";
import {Player} from "../model/character/player";
import DATA from "../server/data";
import {PlayerDAO} from "../dao/playerDAO";
import {InfoResponse} from "../exchange/dataResponse/infoResponse";
import {GlobalError} from "../util/error/globalError";
import {Enum} from "../util/enum/enum";
import {TechnicalError} from "../util/error/technicalError";


export class CharacteristicService{

    server:GameServer;

    constructor(server:GameServer){
        this.server = server;
    }

    async info(profile:Profile):Promise<InfoResponse>{

        LOGGER.logJSON("debug", profile);

        let resp:InfoResponse = new InfoResponse();

        // Get player
        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        player.refresh();

        // Return
        resp.life = player.life;
        resp.lifeMax = player.getLifeMax();
        resp.gold = player.gold;
        resp.xp = player.xp;
        resp.xpMax = player.getXpMax();
        resp.level = player.level;
        resp.ap = player.ap;
        resp.resistance = player.resistance;
        resp.speed = player.speed;
        resp.strength = player.strength;
        resp.vitality = player.vitality;
        resp.resistanceE = player.resistanceE;
        resp.speedE = player.speedE;
        resp.strengthE = player.strengthE;
        resp.vitalityE = player.vitalityE;
        resp.availablePoint = player.availablePoint;
        return resp;
    }

    async increase(characteristic:string, point:number, profile:Profile):Promise<IncreaseResponse>{

        LOGGER.logParams("debug", characteristic, point.toString(), JSON.stringify(profile));
        let resp:IncreaseResponse = new IncreaseResponse();

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        if(!Enum.exist(Enum.CHARACTERISTIC, characteristic)){
            throw new GlobalError("Bad info name");
        }
        if(point > player.availablePoint){
            throw new GlobalError("Insufficient points");
        }

        /* Process */

        player.increaseCharacteristic(characteristic, point);
        await PlayerDAO.save(player);

        resp.availablePoint = player.availablePoint;
        return resp;
    }
}