/**
 * Created by sushi on 06/05/17.
 */

import { GameServer } from '../server/gameServer' ;
import {InventoryResponse, InventoryResponsePotions} from "../exchange/dataResponse/inventoryReponse";
import {UseResponse} from "../exchange/dataResponse/useResponse";
import {LOGGER} from "../server/logger";
import {Profile} from "../server/profile";
import {Player} from "../model/character/player";
import {GlobalError} from "../util/error/globalError";
import {PlayerDAO} from "../dao/playerDAO";
import {TechnicalError} from "../util/error/technicalError";
import DATA from "../server/data";
import {Potion} from "../model/item/potion";
import {PotionDAO} from "../dao/potionDAO";


export class InventoryService{

    server:GameServer;

    constructor(server:GameServer){

        this.server = server;

    }

    async inventory(profile:Profile):Promise<InventoryResponse>{

        LOGGER.logParams("debug", JSON.stringify(profile));

        let resp:InventoryResponse = new InventoryResponse();

        // Get player
        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No eq1 associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        // Return
        for(let [key, val] of player._equipments){
            resp._equipments.push(val);
        }
        for(let [key, val] of player._potions){
            resp._potions.push(new InventoryResponsePotions(key, val));
        }
        return resp;
    }

    async use(potionId:string, qte:number, profile:Profile):Promise<UseResponse>{

        LOGGER.logParams("debug", potionId, qte.toString());

        let resp:UseResponse = new UseResponse();

        // Get player
        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        if(!player._potions.has(potionId)){
            throw new GlobalError("You don't have this potion in your inventory");
        }

        let nbAvailable:number = player._potions.get(potionId);
        if(nbAvailable < qte){
            throw new GlobalError("You don't have this quantity of potion in your inventory");
        }

        // Get potion
        let potion:Potion = await PotionDAO.getById(potionId);

        if(potion == null) {
            throw new TechnicalError("No potion associated with this id");
        }

        player.refresh();
        let winLife:number = player.usePotion(potion, qte);

        await PlayerDAO.save(player);

        resp.winLife = winLife;
        resp.life = player.life;
        resp.lifeMax = player.getLifeMax();
        return resp;
    }

}