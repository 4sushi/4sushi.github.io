import {Character} from "../character/character";
import {Player} from "../character/player";
import {Fighter} from "./fighter";

import * as _ from "underscore";
import {Id} from "../../database/type/id";

/**
 * Created by sushi on 19/09/17.
 */


export abstract class Fight{


    public eq1:Fighter;
    public player:Player;
    protected turn:Number;
    protected time:Number; // Time of fight, in seconde (use for animation in client side)

    constructor(){
        this.turn = 1;
        this.time = 0;
    }

    protected abstract beforeBattle():any;


    protected abstract afterBattle():any;


    protected playerToFighter(player:Player):Fighter{

        let fighter:Fighter = new Fighter();
        fighter._id = player._id;
        fighter.name = player.name;
        fighter.resistance = player.resistance + player.resistanceE;
        fighter.speed = player.speed + player.speedE;
        fighter.strength = player.strength + player.strengthE;
        fighter.vitality = player.vitality + player.vitalityE;
        fighter.level = player.level;
        fighter.life = player.life;
        fighter.lifeMax = player.getLifeMax();


        return fighter;
    }
}