
import AccountDB, {IAccountDB} from "../database/accountDB";
import {Account} from "../model/character/account";
import {MainDAO} from "./mainDAO";
import {LOGGER} from "../server/logger";
import {GameError} from "../util/error/gameError";
export class AccountDAO extends MainDAO{

    public static async isAvailableEmail(email:string):Promise<boolean>{

        LOGGER.logParams("info", email);

        let nb:number = await AccountDB.count({email : email}).exec();
        return nb == 0;

    }

    public static async save(account:Account):Promise<string>{

        LOGGER.logJSON("info", account);

        let json:IAccountDB = AccountDAO.objectToDB(account);
        let accountDb = new AccountDB(json);

        await accountDb.save();

        return accountDb._id;
    }

    public static async getByEmailPassword(email:string, password:string):Promise<Account>{

        LOGGER.logParams("info", email, password);

        let accountDb:IAccountDB;
        let account:Account;

        accountDb = await AccountDB.findOne({'email' : email, 'password' : password});

        if (!accountDb) {
            throw new Error('No data found');
        }

        account = AccountDAO.dbToObject(accountDb);

        return account;
    }

    private static objectToDB(account:Account):IAccountDB{

        let accountDB:any = {
            _id : account._id,
            email : account.email,
            password : account.password,
            _player : account._player
        };

        return accountDB;
    }

    private static dbToObject(json:IAccountDB):Account{

        let account:Account = new Account();
        account._id = json._id.toString();
        account._player = json._player.toString();
        account.password = json.password;
        account.email = json.email;

        return account;
    }
}