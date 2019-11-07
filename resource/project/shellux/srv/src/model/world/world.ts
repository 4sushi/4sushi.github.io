import {Cell} from "./cell";
import {Player} from "../character/player";
import {Enum} from "../../util/enum/enum";
import {Id} from "../../database/type/id";
import {Area} from "./area";
import {LOGGER} from "../../server/logger";
/**
 * Created by sushi on 06/05/17.
 */

export class World{

    constructor(){

    }

    getCellKeyMovement(currentCell:Cell, direction:string):string{
        // Calculate position destination cell
        let x:number = currentCell.x ;
        let y:number = currentCell.y;
        switch(direction){
            case Enum.DIRECTIONS.NORTH :
                y--;
                break;
            case Enum.DIRECTIONS.SOUTH :
                y++;
                break;
            case Enum.DIRECTIONS.EAST :
                x++;
                break;
            case Enum.DIRECTIONS.WEST :
                x--;
                break;
        }

        return Cell.generateKey(x,y);
    }

    movementPlayer(player:Player, currentCell:Cell, nextCell:Cell):void{

        player.cellKey = nextCell.getKey();
        currentCell.delPlayer(player._id);
        nextCell.addPlayer(player._id);

    }

    static getCellKeyStart():string{
        return Cell.generateKey(1,1);
    }

    initWorld(cells:Map<Id,Cell>, areas:Map<Id,Area>){

        LOGGER.logParams("debug", JSON.stringify(cells.size), JSON.stringify(areas.size));

        // Generate group monsters for each cell, and add cell to the world

        for(let [idCell, cell] of cells){

            // Generate monsters
            let area:Area = areas.get(cell._area);
            if(area._monsters.size == 0){
                // If is city
                continue;
            }

            while(cell.groupMonsters.size < 4){
                cell.addGroupMonster(area.getNewGroupMonster());
            }
        }
    }
}
