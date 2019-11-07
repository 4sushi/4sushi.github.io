import {Notification} from "../notification";
/**
 * Created by sushi on 13/10/17.
 */

export class NotificationAttack extends Notification{

    groupMonsterId:string;
    newGroupMonsterId:string;
    playerId:string;
    playerName:string;

    constructor(playerId: string, groupMonsterId: string, newGroupMonsterId:string, playerName:string) {
        super();
        this.groupMonsterId = groupMonsterId;
        this.newGroupMonsterId = newGroupMonsterId;
        this.playerId = playerId;
        this.playerName = playerName;
    }
}
