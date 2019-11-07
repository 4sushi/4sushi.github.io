import {Notification} from "../notification";

export class NotificationMessage extends Notification{

    playerId:string;
    playerName:string;
    message:string;

    constructor(playerId: string, playerName:string, message:string) {
        super();
        this.playerId = playerId;
        this.playerName = playerName;
        this.message = message;
    }
}