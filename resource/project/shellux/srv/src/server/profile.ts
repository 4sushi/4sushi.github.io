import {Player} from "../model/character/player";
import {Id} from "../database/type/id";
/**
 * Created by sushi on 10/06/17.
 */

export class Profile{

    _player:Id = null;
    socketID:string;

    constructor(){

    }


    isConnected():boolean{
        return this._player != null;
    }
}