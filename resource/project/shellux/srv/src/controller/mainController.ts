/**
 * Created by sushi on 06/05/17.
 */

import { GameServer } from '../server/gameServer' ;
import {WorldController} from "./worldController";
import {InventoryController} from "./inventoryController";
import {CharacteristicController} from "./characteristicController";
import {AccountController} from "./accountController";
import {RequestGame} from "../exchange/requestGame";
import {LOGGER} from "../server/logger";
import {GlobalError} from "../util/error/globalError";
import {ResponseGame} from "../exchange/responseGame";
import {GameError} from "../util/error/gameError";
import {Profile} from "../server/profile";
import {CmdParamNumberError} from "../util/error/cmdParamNumberError";


export class MainController{

    server:GameServer;
    accountController: AccountController;
    characteristicController: CharacteristicController;
    inventoryController: InventoryController;
    worldController: WorldController;

    constructor(server:GameServer){

        this.server = server;

        // init services

        this.accountController = new AccountController(server);
        this.characteristicController = new CharacteristicController(server);
        this.inventoryController = new InventoryController(server);
        this.worldController = new WorldController(server);

    }

    async newCommand(data:any, profile:Profile):Promise<ResponseGame>{

        let resp:ResponseGame = new ResponseGame();

        LOGGER.logParams("debug", JSON.stringify(data));

        try{

            /* Control command */
            let command:string = data;

            // Error command
            if(command == null ){
                throw new GlobalError("Bad command");
            }

            let params: string[] = command.split(' ');

            // Error command
            if(params.length == 0){
                throw new GlobalError("Bad command");
            }

            let commandName:string = params[0];

            let req:RequestGame = new RequestGame();
            req.params = params;
            req.profile = profile;


            /* AccountService */

            if(commandName == "login"){

                if(params.length != 3){
                    throw new CmdParamNumberError();
                }

                if(profile.isConnected()){
                    throw new GlobalError("You are already connected");
                }

                resp.data = await this.accountController.login(req);
            }
            else if(commandName == "logout"){

                if(params.length != 1){
                    throw new CmdParamNumberError();
                }

                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use logout");
                }

                resp.data = await this.accountController.logout(req);

            }
            else if(commandName == "signup"){

                if(params.length != 5){
                    throw new CmdParamNumberError();
                }
                if(profile.isConnected()){
                    throw new GlobalError("You are connected, you can't use signup");
                }

                resp.data = await this.accountController.signup(req);
            }

            /* CharacteristicService */

            else if(commandName == "info"){

                if(params.length != 1){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use info");
                }

                resp.data = await this.characteristicController.info(req);

            }
            else if(commandName == "increase"){

                if(params.length != 3){
                    throw new CmdParamNumberError();
                }

                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use increase");
                }

                resp.data = await this.characteristicController.increase(req);
            }

            /* InventoryService */

            else if(commandName == "inventory"){

                if(params.length != 1){
                    throw new CmdParamNumberError();
                }

                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use inventory");
                }

                resp.data = await this.inventoryController.inventory(req);

            }
            else if(commandName == "use"){

                if(params.length != 3){
                    throw new CmdParamNumberError();
                }

                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use use");
                }

                resp.data = await this.inventoryController.use(req);

            }

            /* WorldService */

            else if(commandName == "attack"){
                if(params.length != 2){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use attack");
                }
                resp.data = await this.worldController.attack(req);
            }
            else if(commandName == "buy"){
                if(params.length != 3 && params.length != 2){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use buy");
                }
                resp.data = await this.worldController.buy(req);
            }
            else if(commandName == "kill"){
                if(params.length != 2){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use attack");
                }
                resp.data = await this.worldController.kill(req);
            }
            else if(commandName == "map"){
                if(params.length != 1){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use map");
                }
                resp.data = await this.worldController.map(req);
            }
            else if(commandName == "move"){
                if(params.length != 2){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use move");
                }
                resp.data = await this.worldController.move(req);
            }
            else if(commandName == "say"){
                if(params.length <  2){
                    throw new CmdParamNumberError();
                }
                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use move");
                }
                resp.data = await this.worldController.say(req);
            }
            else if(commandName == "world"){

                if(params.length != 1){
                    throw new CmdParamNumberError();
                }

                if(!profile.isConnected()){
                    throw new GlobalError("You aren't connected, you can't use world");
                }

                resp.data = await this.worldController.world(req);

            }

            /* Error */

            else{
                throw new GlobalError("Bad command");
            }


        }
        catch(e) {
            if (e instanceof GameError) {
                resp.data = e.message;
                resp.code = 1; // TODO : a supp
                LOGGER.logMessage("info", e.message);
            }else {
                resp.data = "Erreur non gérée";
                resp.code = -1; // TODO : a supp
                LOGGER.error(e.stack);
            }
        }
        finally {
            LOGGER.logParams("debug", JSON.stringify(resp));
            return resp;
        }

    }

}