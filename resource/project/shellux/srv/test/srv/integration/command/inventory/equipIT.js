"use strict";
/**
 * Created by sushi on 17/09/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var mainIT_1 = require("../../mainIT");
var profil_1 = require("../../../../../src/server/profil");
var player_1 = require("../../../../../src/game/character/player");
var mongoose = require("mongoose");
var dataBase_1 = require("../../../../../src/database/dataBase");
describe('equipIT', function () {
    var mainIT = new mainIT_1.MainIT();
    var TEST1_ITEM_ID = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("weapon", { _id: TEST1_ITEM_ID, name: "equip1", weight: 1, typeItem: "weapon", sellPrice: 1, agility: 1, resistance: 1, speed: 1, strength: 1, vitality: 1, minLevel: 1 });
    mainIT.addDeleteAfterDataSet("weapon", { _id: TEST1_ITEM_ID });
    var TEST3_ITEM_ID = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("equipment", { _id: TEST3_ITEM_ID, name: "equip1", weight: 1, typeItem: "weapon", sellPrice: 1, agility: 1, resistance: 1, speed: 1, strength: 1, vitality: 1, minLevel: 1, equipmentType: 'armor' });
    mainIT.addDeleteAfterDataSet("equipment", { _id: TEST3_ITEM_ID });
    before(function (done) {
        mainIT.init().then(function () {
            mainIT.insertBeforeDataSet()
                .then(done)
                .catch(function (e) { done(e); });
        })
            .catch(function (e) { done(e); });
    });
    after(function (done) {
        mainIT.deleteAfterDataSet()
            .then(done)
            .catch(function (e) { done(e); });
    });
    // Test 1
    it('equip ok - weapon, without unequip, removing of the equipment in the inventory', function (done) {
        var data = {};
        data.cmd = "equip " + TEST1_ITEM_ID.toHexString();
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player._inventoryWeapons.set(TEST1_ITEM_ID.toHexString(), 1);
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(player.agilityE, 1);
            assert.equal(player.resistanceE, 1);
            assert.equal(player.speedE, 1);
            assert.equal(player.strengthE, 1);
            assert.equal(player.vitalityE, 1);
            assert.equal(player.weapon._id, TEST1_ITEM_ID.toHexString());
            assert.equal(player._inventoryWeapons.get(TEST1_ITEM_ID.toHexString()), null);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 2
    it('equip ok - weapon, without unequip, decrease of the equipment in the inventory', function (done) {
        var data = {};
        data.cmd = "equip " + TEST1_ITEM_ID.toHexString();
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player._inventoryWeapons.set(TEST1_ITEM_ID.toHexString(), 2);
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(player.agilityE, 1);
            assert.equal(player.resistanceE, 1);
            assert.equal(player.speedE, 1);
            assert.equal(player.strengthE, 1);
            assert.equal(player.vitalityE, 1);
            assert.equal(player.weapon._id, TEST1_ITEM_ID.toHexString());
            assert.equal(player._inventoryWeapons.get(TEST1_ITEM_ID.toHexString()), 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 3
    it('equip ok - equipment, without unequip, removing of the equipment in the inventory', function (done) {
        var data = {};
        data.cmd = "equip " + TEST3_ITEM_ID.toHexString();
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player._inventoryEquipments.set(TEST3_ITEM_ID.toHexString(), 1);
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(player.agilityE, 1);
            assert.equal(player.resistanceE, 1);
            assert.equal(player.speedE, 1);
            assert.equal(player.strengthE, 1);
            assert.equal(player.vitalityE, 1);
            assert.equal(player._equipments.get("armor"), TEST3_ITEM_ID.toHexString());
            assert.equal(player._inventoryEquipments.get(TEST3_ITEM_ID.toHexString()), null);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 4
    it('equip ok - equipment, without unequip, decrease of the equipment in the inventory', function (done) {
        var data = {};
        data.cmd = "equip " + TEST3_ITEM_ID.toHexString();
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player._inventoryEquipments.set(TEST3_ITEM_ID.toHexString(), 2);
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(player.agilityE, 1);
            assert.equal(player.resistanceE, 1);
            assert.equal(player.speedE, 1);
            assert.equal(player.strengthE, 1);
            assert.equal(player.vitalityE, 1);
            assert.equal(player._equipments.get("armor"), TEST3_ITEM_ID.toHexString());
            assert.equal(player._inventoryEquipments.get(TEST3_ITEM_ID.toHexString()), 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
});
