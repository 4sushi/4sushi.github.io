/**
 * Created by sushi on 07/05/17.
 */

export class Enum{

    public static readonly DIRECTIONS = {
        NORTH : 'n',
        SOUTH : 's',
        EAST : 'e',
        WEST : 'w'
    };

    public static readonly CHARACTERISTIC = {
        RESISTANCE : 'resistance',
        SPEED : 'speed',
        STRENGTH : 'strength',
        VITALITY : 'vitality'
    };

    public static readonly ITEM_TYPES = {
        CONSUMABLE : 'consumable',
        EQUIPMENT : 'equipment'
    };

    public static readonly EQUIPMENT_TYPES = {
        AMULET : 'amulet',
        ARMOR : 'armor',
        HELMET : 'helmet',
        PANTS : 'pants',
        RING : 'ring',
    };




    public static exist(enumeration:any, key:string){
        for(var i in enumeration){
            if(enumeration[i] == key){
                return true;
            }
        }
        return false;
    };

}