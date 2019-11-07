/**
 * Created by sushi on 06/05/17.
 */

import { GameServer } from '../server/gameServer' ;
import {AttackResponse} from "../exchange/dataResponse/attackResponse";
import {MoveResponse} from "../exchange/dataResponse/moveResponse";
import {Profile} from "../server/profile";
import {LOGGER} from "../server/logger";
import {Player} from "../model/character/player";
import {TechnicalError} from "../util/error/technicalError";
import DATA from "../server/data";
import {Id} from "../database/type/id";
import {Cell} from "../model/world/cell";
import {GlobalError} from "../util/error/globalError";
import {FightAttack} from "../model/fight/fightAttack";
import {MonsterDAO} from "../dao/monsterDAO";
import {Monster} from "../model/character/monster";
import {FightAttackReturn} from "../model/fight/fightReturn/fightAttackReturn";
import {Area} from "../model/world/area";
import {PlayerDAO} from "../dao/playerDAO";
import {
    WorldResponse, WorldResponseGroupMonster,
    WorldResponsePlayer
} from "../exchange/dataResponse/worldResponse";
import {MapResponse} from "../exchange/dataResponse/mapResponse";
import {Enum} from "../util/enum/enum";
import {GroupMonster} from "../model/world/groupMonster";
import {World} from "../model/world/world";
import {ShopDAO} from "../dao/shopDAO";
import {Shop} from "../model/world/shop";
import {BuyResponse} from "../exchange/dataResponse/buyResponse";
import {EquipmentDAO} from "../dao/equipmentDAO";
import {Equipment} from "../model/item/equipment";
import {PotionDAO} from "../dao/potionDAO";
import {Potion} from "../model/item/potion";
import {KillResponse} from "../exchange/dataResponse/killResponse";
import {FightKill} from "../model/fight/fightKill";
import {FightKillReturn} from "../model/fight/fightReturn/fightKillReturn";
import {SayResponse} from "../exchange/dataResponse/sayResponse";


export class WorldService{

    server:GameServer;

    constructor(server:GameServer){

        this.server = server;

    }

    async kill(playerId:string, profile:Profile):Promise<KillResponse>{

        LOGGER.logParams("debug", playerId, JSON.stringify(profile));

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        player.refresh();
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        // Get player target
        let cell:Cell = DATA.getCell(player.cellKey);
        let area:Area = DATA.getArea(cell._area);
        if(cell._players.indexOf(playerId) == -1){
            throw new GlobalError("No player with this id available on the map");
        }
        let player2:Player = DATA.getPlayer(playerId);
        if(player2.isInFight()){
            throw new GlobalError("The player is already in fight on the map");
        }

        /* Process */

        // Lock players
        player.dateEndFight = new Date(new Date().getTime() + 10000);
        player2.dateEndFight = new Date(new Date().getTime() + 10000);

        let fight:FightKill = new FightKill(player, player2);
        let fightReturn:FightKillReturn = fight.run();

        if(fightReturn.eqWin == 1){

        }else{

        }

        await PlayerDAO.save(player);
        await PlayerDAO.save(player2);

        /* Notifications */

        this.server.notification.notificationKill(player, player2._id);
        this.server.notification.notificationStartFight(player, player2, fightReturn);

        /* Return */

        let resp:KillResponse = new KillResponse(
            fightReturn.fighters, fightReturn.turns, fightReturn.eqWin
        );
        resp._visibleEquipmentsPlayer1 = player.getVisibleEquipmentsId();
        resp._visibleEquipmentsPlayer2 = player2.getVisibleEquipmentsId();
        return resp;
    }

    async attack(groupMonsterId:Id, profile:Profile):Promise<AttackResponse>{

        let resp:AttackResponse = null;
        LOGGER.logParams("debug", groupMonsterId, JSON.stringify(profile));

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        // Get group monster
        let cell:Cell = DATA.getCell(player.cellKey);
        let area:Area = DATA.getArea(cell._area);
        if(!cell.groupMonsters.has(groupMonsterId)){
            throw new GlobalError("No group with this id available on the map");
        }
        player.refresh();
        if(player.ap < 5){
            throw new GlobalError("You do not have enough action point, wait a moment...");
        }

        /* Process */

        let groupMonster:GroupMonster = cell.groupMonsters.get(groupMonsterId);
        // Delete group of monster on the map
        cell.groupMonsters.delete(groupMonsterId);
        // Lock player
        player.dateEndFight = new Date(new Date().getTime() + 10000);
        let monsters:Array<Monster> = await MonsterDAO.getArrayByIds(groupMonster._monsters);
        // Set level monsters
        for(let i = 0; i < monsters.length; i++){
            monsters[i].assignLevel(groupMonster.levels[i], area.levelMinMonster, area.levelMaxMonster);
        }

        let fight:FightAttack = new FightAttack(player, monsters);
        let fightReturn:FightAttackReturn = fight.run();
        if(fightReturn.eqWin == 2){
            DATA.getWorld().movementPlayer(player, cell, DATA.getCell(World.getCellKeyStart()));
        }
        // Add new group of monsters
        let newGroupMonsterId:string = cell.addGroupMonster(area.getNewGroupMonster());
        await PlayerDAO.save(player);

        /* Notification */

        this.server.notification.notificationAttack(player, groupMonsterId, newGroupMonsterId);

        /* Response */

        resp = new AttackResponse();
        resp._visibleEquipmentsPlayer = player.getVisibleEquipmentsId();
        resp.fighters = fightReturn.fighters;
        resp.turns = fightReturn.turns;
        resp.eqWin = fightReturn.eqWin;
        resp.winGold = fightReturn.winGold;
        resp.winXp = fightReturn.winXp;
        resp.levelUp = fightReturn.levelUp;
        return resp;
    }

    async buy(itemId:string, qt:number, profile:Profile):Promise<BuyResponse>{

        LOGGER.logParams("debug", itemId, JSON.stringify(profile));

        let resp:BuyResponse = new BuyResponse();

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        let cell:Cell = DATA.getCell(player.cellKey);
        if(cell._shop == null){
            throw new GlobalError("No shop on this cell");
        }
        let shop:Shop = await ShopDAO.getById(cell._shop);
        let price:number = 0;
        let typeItem = '';
        let nameItem = '';
        let equipment:Equipment = null;
        if(shop._potions.indexOf(itemId) != -1){
            let potion:Potion = await PotionDAO.getById(itemId);
            price = potion.sellPrice;
            nameItem = potion.name;
            typeItem = Enum.ITEM_TYPES.CONSUMABLE;
        }
        else if(shop._equipments.indexOf(itemId) != -1){
            equipment = await EquipmentDAO.getById(itemId);
            price = equipment.sellPrice;
            nameItem = equipment.name;
            typeItem = Enum.ITEM_TYPES.EQUIPMENT;
            if(equipment.minLevel > player.level){
                throw new GlobalError("You do not have the required level to buy this equipment");
            }
        }else{
            throw new GlobalError("This item is not available on this shop");
        }
        price = price * qt;
        if(player.gold < price){
            throw new GlobalError("You do not have enough money to buy this item(s)");
        }

        /* Process */

        player.gold -= price;
        if(typeItem == Enum.ITEM_TYPES.CONSUMABLE){
            player.addPotion(itemId, qt);
        }else{
            let oldEquipment:Equipment = await EquipmentDAO.getById(player._equipments.get(equipment.type));
            if(oldEquipment != null){
                player.unequip(oldEquipment);
            }
            player.equip(equipment);
        }
        await PlayerDAO.save(player);

        /* Response */

        resp.gold = player.gold;
        resp.price = price;
        resp.name = nameItem;
        return resp;
    }

    async map(profile:Profile):Promise<MapResponse>{

        LOGGER.logParams("debug", JSON.stringify(profile));

        let resp:MapResponse = new MapResponse();

        let player:Player = DATA.getPlayer(profile._player);
        let cell:Cell = DATA.getCell(player.cellKey);
        let area = DATA.getArea(cell._area);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }

        resp.cellKey = player.cellKey;
        resp.areaName = area.name;
        return resp;
    }

    async move(direction:string, profile:Profile):Promise<MoveResponse>{

        LOGGER.logParams("debug", direction, JSON.stringify(profile));
        let resp:MoveResponse = new MoveResponse();

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }
        if(!Enum.exist(Enum.DIRECTIONS, direction)){
            throw new GlobalError("Bad direction, use : n,s,e,w");
        }
        let oldCell = DATA.getCell(player.cellKey);
        let cellKeyNextCell:string = DATA.getWorld().getCellKeyMovement(oldCell, direction);
        if(DATA.getCell(cellKeyNextCell) == null){
            throw new GlobalError("Impossible to move to this direction");
        }
        player.refresh();
        if(player.ap < 1){
            throw new GlobalError("You do not have enough action point to move, wait a moment...");
        }

        /* Process */

        let newCell = DATA.getCell(cellKeyNextCell);
        let newArea = DATA.getArea(newCell._area);
        DATA.getWorld().movementPlayer(player, oldCell, newCell);
        player.ap -= 1;
        await PlayerDAO.save(player);

        /* Notifications */

        this.server.notification.notificationLeaveCell(player, oldCell);
        this.server.notification.notificationJoinCell(player);

        /* Response */
        resp.cellKey = newCell.getKey();
        resp.areaName = newArea.name;
        return resp;
    }

    async say(message:string, profile:Profile):Promise<SayResponse>{

        LOGGER.logJSON("debug", profile);
        let resp:SayResponse = new SayResponse();

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }

        /* Notification */

        this.server.notification.notificationMessage(player, message);

        /* Response */

        return resp;
    }

    async world(profile:Profile):Promise<WorldResponse>{

        LOGGER.logJSON("debug", profile);
        let resp:WorldResponse = new WorldResponse();

        /* Controls */

        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }
        if(player.isInFight()){
            throw new GlobalError("You are actually in fight, you can not use this command");
        }

        /* Response */

        let cell:Cell = DATA.getCell(player.cellKey);
        // Shop
        if(cell._shop != null){
            let shop:Shop = DATA.getShop(cell._shop);
            resp.shop._id = shop._id;
            resp.shop.name = shop.name;
            resp.shop._equipments = shop._equipments;
            resp.shop._potions = shop._potions;
        }
        // Monsters
        for(let [groupMonsterId,groupMonster] of cell.groupMonsters){
            let respMonster:WorldResponseGroupMonster = new WorldResponseGroupMonster();
            respMonster._id = groupMonster._id;
            respMonster._monsters = groupMonster._monsters;
            respMonster.levels = groupMonster.levels;
            resp.groupMonsters.push(respMonster);
        }
        // Players
        for(let idP of cell._players){
            let p:Player = DATA.getPlayer(idP);
            let respPlayer:WorldResponsePlayer = new WorldResponsePlayer();
            respPlayer.level = p.level;
            respPlayer.name = p.name;
            respPlayer.inFight = p.isInFight();
            respPlayer._id = p._id;
            respPlayer._visibleEquipments = p.getVisibleEquipmentsId();
            resp.players.push(respPlayer);
        }

        return resp;
    }



}
