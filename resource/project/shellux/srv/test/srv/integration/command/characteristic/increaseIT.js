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
describe('increaseIT', function () {
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
    it('increase ok - agility', function (done) {
        var data = {};
        data.cmd = "increase agility 1";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(mainIT.server.data.players.get(player._id).agility, 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 2
    it('increase ok - resistance', function (done) {
        var data = {};
        data.cmd = "increase resistance 1";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(mainIT.server.data.players.get(player._id).resistance, 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 3
    it('increase ok - speed', function (done) {
        var data = {};
        data.cmd = "increase speed 2";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 2;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(mainIT.server.data.players.get(player._id).speed, 2);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 4
    it('increase ok - strength', function (done) {
        var data = {};
        data.cmd = "increase strength 1";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 2;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 1);
            assert.equal(mainIT.server.data.players.get(player._id).strength, 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 5
    it('increase ok - vitality', function (done) {
        var data = {};
        data.cmd = "increase vitality 1";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(mainIT.server.data.players.get(player._id).vitality, 1);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 6
    it('increase ko - You aren\'t connected, you can\'t use increase', function (done) {
        var data = {};
        data.cmd = "increase agility 1";
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You aren't connected, you can't use increase");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 7
    it('increase ko - Bad characteristic name', function (done) {
        var data = {};
        data.cmd = "increase badname 1";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Bad characteristic name");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 8
    it('increase ko - Insufficient points', function (done) {
        var data = {};
        data.cmd = "increase agility 2";
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = dataBase_1.DataBase.generateId();
        // Init player
        var player = new player_1.Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add player on memory
        mainIT.server.data.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Insufficient points");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
});
