import {DataResponse} from "../dataResponse";

export class InventoryResponse extends DataResponse{
    _equipments:Array<string> = [];
    _potions:Array<InventoryResponsePotions> = [];
}

export class InventoryResponsePotions{
    _id :string;
    qt : number;

    constructor(id: string, qt: number) {
        this._id = id;
        this.qt = qt;
    }
}