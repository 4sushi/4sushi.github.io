import {Id} from "../../database/type/id";
/**
 * Created by sushi on 06/05/17.
 */

export class Account{

    _id:Id;
    email:string;
    password:string;
    _player:Id;

    constructor(){
    }

    static isEmailFormatOk(email:string):boolean{
        let regex:any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    // Password need :
    // upper case >= 1
    // lower case >= 1
    // digit >= 1
    // 8 <= size <= 30
    // Source : http://stackoverflow.com/questions/19605150/regex-for-password-must-be-contain-at-least-8-characters-least-1-number-and-bot
    static isPasswordFormatOk(password:string):boolean{
        //let regex:any = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,30}$/;
        //return regex.test(password);
        return password.length >= 6;
    }

    static isSamePasswords(password1:string, password2:string):boolean {

        if(password1 == null || password2 == null){
            return false;
        }

        return (password1 === password2);
    }
}
