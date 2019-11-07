/**
 * Created by sushi on 21/09/17.
 */

export class TurnTrace{

    attacks:Array<AttackTrace> = new Array();

    addAttackTrace(iAttacker:number, iTarget:number, strikes:Array<number>, lifeTarget:number):void{
        let attack:AttackTrace = new AttackTrace();
        attack.strikes = strikes;
        attack.iAttacker = iAttacker;
        attack.iTarget = iTarget;
        attack.lifeTarget = lifeTarget;
        this.attacks.push(attack);
    }
}

class AttackTrace{

    strikes:Array<number> = new Array();
    iAttacker:number;
    iTarget:number;
    lifeTarget:number;
}