import {Notification} from "../notification";

export class NotificationKill extends Notification {

    player1Id: string;
    player2Id: string;

    constructor(player1Id: string, player2Id: string) {
        super();
        this.player1Id = player1Id;
        this.player2Id = player2Id;
    }
}