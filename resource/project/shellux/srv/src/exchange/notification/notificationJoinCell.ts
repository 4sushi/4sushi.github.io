import {Notification} from "../notification";

export class NotificationJoinCell extends Notification{

    playerId:string;
    playerName:string;

    constructor(playerId: string, playerName:string) {
        super();
        this.playerId = playerId;
        this.playerName = playerName;
    }
}