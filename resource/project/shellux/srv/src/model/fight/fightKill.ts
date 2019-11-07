import {Fight} from "./fight";
import {Fighter} from "./fighter";
import {Player} from "../character/player";
import {TurnTrace} from "./fightReturn/turnTrace";
import {FightKillReturn} from "./fightReturn/fightKillReturn";

export class FightKill extends Fight{

    public eq2:Fighter;
    public player2:Player;
    fightReturn:FightKillReturn;

    constructor(player1:Player, player2:Player){
        super();
        this.fightReturn = new FightKillReturn();
        this.eq1 = this.playerToFighter(player1);
        this.eq2 = this.playerToFighter(player2);
        this.player = player1;
        this.player2 = player2;
    }


    public run():FightKillReturn{
        this.beforeBattle();
        this.battle();
        this.afterBattle();
        return this.fightReturn;
    }

    protected beforeBattle():any{
        this.fightReturn.addFighters(this.eq1, this.eq2);
    }

    protected battle():void{
        // Trace
        let strikes:Array<number> = new Array();
        while(this.eq1 != null && this.eq2 != null){
            let turnTrace:TurnTrace = new TurnTrace();
            if(this.eq1 != null){
                let attacker:Fighter = this.eq1;
                let target:Fighter = this.eq2;
                strikes = attacker.attack(target);
                turnTrace.addAttackTrace(0, 1, strikes, target.life);
                if(target.life <= 0){
                    this.eq2 = null;
                }
            }
            if(this.eq2 != null){
                let attacker:Fighter = this.eq2;
                let target:Fighter = this.eq1;
                strikes = attacker.attack(target);
                turnTrace.addAttackTrace(1, 0, strikes, target.life);
                if(target.life <= 0){
                    this.eq1 = null;
                }
            }
            this.fightReturn.turns.push(turnTrace);
        }
    }

    protected afterBattle():any{
        this.fightReturn.eqWin = (this.eq1 != null) ? 1 : 2;
        if(this.fightReturn.eqWin == 1){
            this.player2.life = 1;
        }
        else{
            this.player.life = 1;
        }
    }

}