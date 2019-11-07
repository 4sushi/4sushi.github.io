/**
 * Created by sushi on 06/05/17.
 */

import { GameServer } from '../server/gameServer' ;
import {LOGGER} from "../server/logger";
import {AccountDAO} from "../dao/accountDAO";
import {Account} from "../model/character/account";
import {GlobalError} from "../util/error/globalError";
import {Player} from "../model/character/player";
import {PlayerDAO} from "../dao/playerDAO";
import {SignupResponse} from "../exchange/dataResponse/signupResponse";
import {LoginResponse} from "../exchange/dataResponse/loginResponse";
import {Profile} from "../server/profile";
import DATA from "../server/data";
import  {DataBase} from "../database/dataBase";
import {Cell} from "../model/world/cell";
import {TechnicalError} from "../util/error/technicalError";


export class AccountService{

    private server:GameServer;

    constructor(server:GameServer){
        this.server = server;
    }

    async login(email:string, password:string, profile:Profile):Promise<LoginResponse>{

        LOGGER.logParams("debug", email, password);
        let resp:LoginResponse = new LoginResponse();
        let account:Account;
        let player:Player;

        // Contrôles

        if(!Account.isEmailFormatOk(email)){
            throw new GlobalError('Invalid email format');
        }

        // Get account
        try{
            account = await AccountDAO.getByEmailPassword(email, password);
        }catch(e){
            throw new GlobalError('Invalid email or password');
        }

        // Get player
        player = await PlayerDAO.getById(account._player);

        // Add eq1 to data memory
        DATA.addPlayer(player);

        // Add player to the map
        let cell:Cell = DATA.getCell(player.cellKey);
        cell.addPlayer(player._id);

        // Session
        profile._player = player._id;
        player._profile = profile.socketID;

        // Notification broadcast socket
        this.server.notification.notificationLogin(player);

        // Return
        resp.playerName = player.name;
        return resp;
    }

    async logout(profile:Profile):Promise<void>{

        LOGGER.logMessage("debug", '');

        // Get player
        let player:Player = DATA.getPlayer(profile._player);
        if(player == null){
            throw new TechnicalError("No player associated with this session");
        }

        // Save player
        await PlayerDAO.save(player);

        // Delete on map
        let cell:Cell = DATA.getCell(player.cellKey);
        cell.delPlayer(player._id);

        // Delete on data memory
        DATA.delPlayer(player._id);

        // Session
        profile._player = null;

        // Notification broadcast socket
        this.server.notification.notificationLogout(player);

    }

    async signup(playerName:string, email:string, password1:string, password2:string):Promise<SignupResponse>{

        LOGGER.logParams("debug", playerName, email, password1, password2);

        let playerId:string;
        let accountId:string;
        let resp:SignupResponse = new SignupResponse();

        // Contrôles

        if(!Account.isEmailFormatOk(email)){
            throw new GlobalError('Invalid email format');
        }
        if(!Account.isPasswordFormatOk(password1)){
            throw new GlobalError('Invalid password format, need minimum 6 characters');
        }
        if(!Account.isSamePasswords(password1, password2)){
            throw new GlobalError('Passwords aren\'t identical');
        }
        let isAvailableEmail:boolean = await AccountDAO.isAvailableEmail(email);
        if(!isAvailableEmail){
            throw new GlobalError('Email is already used');
        }
        let isAvailableName:boolean = await PlayerDAO.isAvailableName(playerName);
        if(!isAvailableName){
             throw new GlobalError('Player name is already used');
        }

        // Création des ids
        playerId = DataBase.generateId();
        accountId = DataBase.generateId();

        // Création du joueur
        let player:Player = new Player();
        player.setDefault();
        player.name = playerName;
        player._id = playerId;
        player._account = accountId;
        await PlayerDAO.save(player);

        // Création du compte
        let account:Account = new Account();
        account.email = email;
        account.password = password1;
        account._id = accountId;
        account._player = playerId;
        await AccountDAO.save(account);

        // Retour
        resp.playerName = playerName;
        return resp;
    }

}