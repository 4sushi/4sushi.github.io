"use strict";
/**
 * Created by sushi on 15/09/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var mainIT_1 = require("../../mainIT");
var profil_1 = require("../../../../../src/server/profil");
var player_1 = require("../../../../../src/game/character/player");
var dataBase_1 = require("../../../../../src/database/dataBase");
describe('characteristicIT', function () {
    var mainIT = new mainIT_1.MainIT();
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
    it('characteristic ok', function (done) {
        var data = {};
        data.cmd = "characteristic";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        // Add player on the map
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.agility, 0);
            assert.equal(responseGame.data.resistance, 0);
            assert.equal(responseGame.data.speed, 0);
            assert.equal(responseGame.data.strength, 0);
            assert.equal(responseGame.data.vitality, 0);
            assert.equal(responseGame.data.agilityE, 0);
            assert.equal(responseGame.data.resistanceE, 0);
            assert.equal(responseGame.data.speedE, 0);
            assert.equal(responseGame.data.strengthE, 0);
            assert.equal(responseGame.data.vitalityE, 0);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 2
    it('characteristic ko - You aren\'t connected, you can\'t use characteristic', function (done) {
        var data = {};
        data.cmd = "characteristic";
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You aren't connected, you can't use characteristic");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
});
