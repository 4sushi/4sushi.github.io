import {AccountService} from "../service/accountService";
import {GameServer} from "../server/gameServer";
import {LoginResponse} from "../exchange/dataResponse/loginResponse";
import {LogoutResponse} from "../exchange/dataResponse/logoutResponse";
import {SignupResponse} from "../exchange/dataResponse/signupResponse";
import {RequestGame} from "../exchange/requestGame";
import {LOGGER} from "../server/logger";

export class AccountController{

    server:GameServer;
    accountService:AccountService;


    constructor(server:GameServer){

        this.server = server;
        this.accountService = new AccountService(server);
    }

    async login(req:RequestGame):Promise<LoginResponse>{

        LOGGER.logParams('debug', req.params[0], req.params[1], req.params[2]);


        let response:LoginResponse;
        let accountEmail:string = req.params[1];
        let accountPassword:string = req.params[2];

        response = await this.accountService.login(accountEmail, accountPassword, req.profile);

        return response;
    }

    async logout(req:RequestGame):Promise<LogoutResponse>{

        LOGGER.logMessage('debug', req.params[0]);

        let response:LogoutResponse = new LogoutResponse();

        await this.accountService.logout(req.profile);

        return response;
    }

    async signup(req:RequestGame):Promise<SignupResponse> {

        LOGGER.logParams('debug', req.params[0], req.params[1], req.params[2], req.params[3], req.params[4]);

        let response:SignupResponse;

        let playerName:string = req.params[1];
        let accountEmail:string = req.params[2];
        let accountPassword:string = req.params[3];
        let accountPassword2:string = req.params[4];

        response = await this.accountService.signup(playerName, accountEmail, accountPassword, accountPassword2);

        return response;
    }

}
