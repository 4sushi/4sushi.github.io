import {Notification} from "../notification";

export class NotificationLogout extends Notification{

    playerId:string;
    playerName:string;

    constructor(playerId: string, playerName:string) {
        super();
        this.playerId = playerId;
        this.playerName = playerName;
    }
}