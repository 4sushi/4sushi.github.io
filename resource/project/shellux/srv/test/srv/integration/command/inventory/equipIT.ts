/**
 * Created by sushi on 17/09/17.
 */


import * as assert from "assert";
import {MainIT} from "../../mainIT";
import {ResponseGame} from "../../../../../src/controller/exchange/responseGame";
import {Profile} from "../../../../../src/server/profile";
import {Player} from "../../../../../src/model/character/player";
import {Cell} from "../../../../../src/model/world/cell";
import * as mongoose from "mongoose";
import {DataBase} from "../../../../../src/database/dataBase";
import {Weapon} from "../../../../../src/model/item/weapon";

describe('equipIT', () => {
    /*

    var mainIT : MainIT = new MainIT();

    const TEST1_ITEM_ID:mongoose.Types.ObjectId = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("weapon", {_id : TEST1_ITEM_ID, name : "equip1", weight : 1, typeItem : "weapon", sellPrice : 1, agility : 1, resistance : 1, speed : 1, strength : 1,vitality : 1, minLevel : 1});
    mainIT.addDeleteAfterDataSet("weapon", {_id : TEST1_ITEM_ID});

    const TEST3_ITEM_ID:mongoose.Types.ObjectId = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("equipment", {_id : TEST3_ITEM_ID, name : "equip1", weight : 1, typeItem : "weapon", sellPrice : 1, agility : 1, resistance : 1, speed : 1, strength : 1,vitality : 1, minLevel : 1, equipmentType : 'armor'});
    mainIT.addDeleteAfterDataSet("equipment", {_id : TEST3_ITEM_ID});

    before((done) => {
        mainIT.init().then(()=>{
            mainIT.insertBeforeDataSet()
                .then(done)
                .catch((e:any) => {done(e)});
        })
            .catch((e:any) => {done(e)});
    });

    after((done)=> {
        mainIT.deleteAfterDataSet()
            .then(done)
            .catch((e:any) => {done(e)});
    });

    // Test 1
    it('equip ok - weapon, without unequip, removing of the equipment in the inventory', (done) => {
        let data:any = {};
        data.cmd = "equip " + TEST1_ITEM_ID.toHexString();
        // Init connect profile
        let profile:Profile = new Profile();
        profile.playerId = DataBase.generateId();
        // Init eq1
        let eq1:Player = new Player();
        eq1._id = profile.playerId;
        eq1.setDefault();
        eq1._inventoryWeapons.set(TEST1_ITEM_ID.toHexString(), 1);
        // Add eq1 on memory
        mainIT.server.data.players.set(eq1._id, eq1);

        mainIT.server.evtCmd(data, profile).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(eq1.agilityE, 1);
            assert.equal(eq1.resistanceE, 1);
            assert.equal(eq1.speedE, 1);
            assert.equal(eq1.strengthE, 1);
            assert.equal(eq1.vitalityE, 1);
            assert.equal(eq1.weapon._id, TEST1_ITEM_ID.toHexString());
            assert.equal(eq1._inventoryWeapons.get(TEST1_ITEM_ID.toHexString()), null);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 2
    it('equip ok - weapon, without unequip, decrease of the equipment in the inventory', (done) => {
        let data:any = {};
        data.cmd = "equip " + TEST1_ITEM_ID.toHexString();
        // Init connect profile
        let profile:Profile = new Profile();
        profile.playerId = DataBase.generateId();
        // Init eq1
        let eq1:Player = new Player();
        eq1._id = profile.playerId;
        eq1.setDefault();
        eq1._inventoryWeapons.set(TEST1_ITEM_ID.toHexString(), 2);
        // Add eq1 on memory
        mainIT.server.data.players.set(eq1._id, eq1);

        mainIT.server.evtCmd(data, profile).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(eq1.agilityE, 1);
            assert.equal(eq1.resistanceE, 1);
            assert.equal(eq1.speedE, 1);
            assert.equal(eq1.strengthE, 1);
            assert.equal(eq1.vitalityE, 1);
            assert.equal(eq1.weapon._id, TEST1_ITEM_ID.toHexString());
            assert.equal(eq1._inventoryWeapons.get(TEST1_ITEM_ID.toHexString()), 1);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 3
    it('equip ok - equipment, without unequip, removing of the equipment in the inventory', (done) => {
        let data:any = {};
        data.cmd = "equip " + TEST3_ITEM_ID.toHexString();
        // Init connect profile
        let profile:Profile = new Profile();
        profile.playerId = DataBase.generateId();
        // Init eq1
        let eq1:Player = new Player();
        eq1._id = profile.playerId;
        eq1.setDefault();
        eq1._inventoryEquipments.set(TEST3_ITEM_ID.toHexString(), 1);
        // Add eq1 on memory
        mainIT.server.data.players.set(eq1._id, eq1);

        mainIT.server.evtCmd(data, profile).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(eq1.agilityE, 1);
            assert.equal(eq1.resistanceE, 1);
            assert.equal(eq1.speedE, 1);
            assert.equal(eq1.strengthE, 1);
            assert.equal(eq1.vitalityE, 1);
            assert.equal(eq1._equipments.get("armor"), TEST3_ITEM_ID.toHexString());
            assert.equal(eq1._inventoryEquipments.get(TEST3_ITEM_ID.toHexString()), null);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 4
    it('equip ok - equipment, without unequip, decrease of the equipment in the inventory', (done) => {
        let data:any = {};
        data.cmd = "equip " + TEST3_ITEM_ID.toHexString();
        // Init connect profile
        let profile:Profile = new Profile();
        profile.playerId = DataBase.generateId();
        // Init eq1
        let eq1:Player = new Player();
        eq1._id = profile.playerId;
        eq1.setDefault();
        eq1._inventoryEquipments.set(TEST3_ITEM_ID.toHexString(), 2);
        // Add eq1 on memory
        mainIT.server.data.players.set(eq1._id, eq1);

        mainIT.server.evtCmd(data, profile).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(eq1.agilityE, 1);
            assert.equal(eq1.resistanceE, 1);
            assert.equal(eq1.speedE, 1);
            assert.equal(eq1.strengthE, 1);
            assert.equal(eq1.vitalityE, 1);
            assert.equal(eq1._equipments.get("armor"), TEST3_ITEM_ID.toHexString());
            assert.equal(eq1._inventoryEquipments.get(TEST3_ITEM_ID.toHexString()), 1);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

*/

});