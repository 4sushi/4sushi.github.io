import {Player} from "../model/character/player";
import Server = SocketIO.Server;
import {NotificationLogin} from "../exchange/notification/notificationLogin";
import DATA from "./data";
import {Cell} from "../model/world/cell";
import {NotificationLogout} from "../exchange/notification/notificationLogout";
import {NotificationLeaveCell} from "../exchange/notification/notificationLeaveCell";
import {NotificationJoinCell} from "../exchange/notification/notificationJoinCell";
import {NotificationAttack} from "../exchange/notification/notificationAttack";
import {NotificationKill} from "../exchange/notification/notificationKill";
import {NotificationStartFight} from "../exchange/notification/notificationStartFight";
import {FightKillReturn} from "../model/fight/fightReturn/fightKillReturn";
import {NotificationMessage} from "../exchange/notification/notificationMessage";
/**
 * Created by sushi on 16/10/17.
 */

export class NotificationSocket{

    private io: Server;

    constructor(io:Server){
        this.io = io;
    }

    private send(players:Array<Player>, notificationName:string, notificationReturn:any):void{
        for(let player of players){
            this.io.to(player._profile).emit("notification", notificationName, notificationReturn);
        }
    }

    private removeCurrentPlayer(currentPlayer:Player, playersCell:Array<Player>):void{
        let length = playersCell.length;
        for(let i =0; i <length; i++){
            if(playersCell[i]._id == currentPlayer._id){
                playersCell.splice(i,1);
                i = length; // exit loop
            }
        }
    }

    private removePlayersNotAvailable(playersCell:Array<Player>):void{
        for(let i =playersCell.length - 1; i >= 0; i--){
            if(playersCell[i].isInFight() == true){
                playersCell.splice(i,1);
            }
        }
    }

    // Broadcast cell
    notificationLogin(currentPlayer:Player):void{
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationLogin:NotificationLogin = new NotificationLogin(currentPlayer._id, currentPlayer.name);
        this.removeCurrentPlayer(currentPlayer, playersCell);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'login', notificationLogin);
    }

    // Broadcast cell
    notificationLogout(currentPlayer:Player):void{
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationLogout:NotificationLogout = new NotificationLogout(currentPlayer._id, currentPlayer.name);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'logout', notificationLogout);
    }

    // Broadcast cell
    notificationLeaveCell(currentPlayer:Player, oldCell:Cell){
        let playersCell:Array<Player> = DATA.getPlayers(oldCell._players);
        let notificationLeaveCell:NotificationLeaveCell = new NotificationLeaveCell(currentPlayer._id, currentPlayer.name);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'leaveCell', notificationLeaveCell);
    }

    // Broadcast cell
    notificationJoinCell(currentPlayer:Player){
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationJoinCell:NotificationJoinCell = new NotificationJoinCell(currentPlayer._id, currentPlayer.name);
        this.removeCurrentPlayer(currentPlayer, playersCell);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'joinCell', notificationJoinCell);
    }

    // Broadcast cell
    notificationAttack(currentPlayer:Player, groupMonsterId:string, newGroupMonsterId:string){
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationAttack:NotificationAttack = new NotificationAttack(currentPlayer._id,groupMonsterId, newGroupMonsterId, currentPlayer.name);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'attack', notificationAttack);
    }

    // Broadcast cell
    notificationKill(currentPlayer:Player, player2Id:string){
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationKill:NotificationKill = new NotificationKill(currentPlayer._id,player2Id);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'kill', notificationKill);
    }

    // Unicast
    notificationStartFight(playerAttack:Player, playerTarget:Player, fightReturn:FightKillReturn){
        let player:Array<Player> = [playerTarget];
        let notificationStartFight:NotificationStartFight = new NotificationStartFight(
            fightReturn.fighters, fightReturn.turns, fightReturn.eqWin
        );
        notificationStartFight.visibleEquipmentsIdPlayer1 = playerAttack.getVisibleEquipmentsId();
        notificationStartFight.visibleEquipmentsIdPlayer2 = playerTarget.getVisibleEquipmentsId();
        this.send(player, 'startFight', notificationStartFight);
    }

    // Unicast
    notificationMessage(currentPlayer:Player, message:string){
        let cell:Cell = DATA.getCell(currentPlayer.cellKey);
        let playersCell:Array<Player> = DATA.getPlayers(cell._players);
        let notificationMessage:NotificationMessage = new NotificationMessage(currentPlayer._id, currentPlayer.name, message);
        this.removePlayersNotAvailable(playersCell);
        this.send(playersCell, 'message', notificationMessage);
    }
}