import {Fight} from "./fight";
import {Monster} from "../character/monster";
import {Player} from "../character/player";

import {Fighter} from "./fighter";
import {FightAttackReturn} from "./fightReturn/fightAttackReturn";
import {TurnTrace} from "./fightReturn/turnTrace";

/**
 * Created by sushi on 19/09/17.
 */

export class FightAttack extends Fight{

    public eq2:Array<Fighter>;
    public monsters:Array<Monster>;
    fightReturn:FightAttackReturn;


    constructor(player:Player, monsters:Array<Monster>){

        super();
        this.fightReturn = new FightAttackReturn();
        this.eq1 = this.playerToFighter(player);
        this.eq2 = this.monstersToFighters(monsters);
        this.player = player;
        this.monsters = monsters;
    }


    public run():FightAttackReturn{

        this.beforeBattle();
        this.battle();
        this.afterBattle();

        return this.fightReturn;
    }

    protected beforeBattle():any{

        this.fightReturn.addFighters(this.eq1, this.eq2);

    }

    protected battle():void{

        let iTargetEq2 = 0; // Index target


        // Trace
        let strikes:Array<number> = new Array();

        while(this.eq1 != null && iTargetEq2 < this.eq2.length){

            let turnTrace:TurnTrace = new TurnTrace();

            if(this.eq1 != null){
                let attacker:Fighter = this.eq1;
                let target:Fighter = this.eq2[iTargetEq2];
                strikes = attacker.attack(target);
                turnTrace.addAttackTrace(0, iTargetEq2 + 1, strikes, target.life);
                if(target.life <= 0){
                    iTargetEq2++;
                }

            }
            for(let i = iTargetEq2; i < this.eq2.length && this.eq1 != null; i++){
                let attacker:Fighter = this.eq2[i];
                let target:Fighter = this.eq1;
                strikes = attacker.attack(target);
                turnTrace.addAttackTrace(i+1, 0, strikes, target.life);
                if(target.life <= 0){
                    this.eq1 = null;
                }
            }
            this.fightReturn.turns.push(turnTrace);
        }
    }


    protected afterBattle():any{

        this.player.ap -= 5;
        this.player.dateEndFight = new Date(new Date().getTime() + this.fightReturn.turns.length * 1500);
        this.player.dateWinLife = this.player.dateEndFight;
        this.fightReturn.eqWin = (this.eq1 != null) ? 1 : 2;

        if(this.fightReturn.eqWin == 1){
            this.winBattle();
        }
        else{
            this.looseBattle();
        }

    }


    private winBattle():void{

        let xp:number = 0;
        let gold:number = 0;

        for(let monster of this.monsters){
            xp += monster.xp;
            gold += monster.gold;
        }

        xp *= this.monsters.length;

        this.player.life = this.eq1.life;
        this.player.gold += gold;
        this.fightReturn.levelUp = this.player.winXp(xp);
        this.fightReturn.winXp = xp;
        this.fightReturn.winGold = gold;
    }

    private looseBattle():void{

        this.player.life = 1;
        this.fightReturn.winXp = 0;

    }

    private monstersToFighters(monsters:Array<Monster>):Array<Fighter>{

        let fighters:Array<Fighter> = new Array();

        for(let monster of monsters){
            let fighter:Fighter = new Fighter();
            fighter._id = monster._id;
            fighter.name = monster.name;
            fighter.resistance = monster.resistance ;
            fighter.speed = monster.speed ;
            fighter.strength = monster.strength ;
            fighter.vitality = monster.vitality ;
            fighter.level = monster.level;
            fighter.life = monster.life;
            fighter.lifeMax = monster.life;

            fighters.push(fighter);
        }

        return fighters;
    }


}