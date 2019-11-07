/**
 * Created by sushi on 15/09/17.
 */

import * as assert from "assert";
import {MainIT} from "../../mainIT";
import {ResponseGame} from "../../../../../src/controller/exchange/responseGame";
import {Profile} from "../../../../../src/server/profile";
import {Player} from "../../../../../src/model/character/player";
import {Cell} from "../../../../../src/model/world/cell";
import * as mongoose from "mongoose";
import {DataBase} from "../../../../../src/database/dataBase";
import DATA from "../../../../../src/server/data";

describe('increaseIT', () => {

    var mainIT : MainIT = new MainIT();

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
    it('increase ok - agility', (done) => {
        let data:any = {};
        data.cmd = "increase agility 1";
        // Init connect profile
        // Init eq1
        let player:Player = new Player();
        player._id = DataBase.generateId();
        player.setDefault();
        player.availablePoint = 1;
        let profil:Profile = new Profile();
        profil.player = player;
        // Add eq1 on memory
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(DATA.players.get(player._id).agility, 1);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });

    // Test 2
    it('increase ok - resistance', (done) => {
        let data:any = {};
        data.cmd = "increase resistance 1";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add eq1 on memory
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(DATA.players.get(player._id).resistance, 1);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });

    // Test 3
    it('increase ok - speed', (done) => {
        let data:any = {};
        data.cmd = "increase speed 2";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 2;
        // Add eq1 on memory
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(DATA.players.get(player._id).speed, 2);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });

    // Test 4
    it('increase ok - strength', (done) => {
        let data:any = {};
        data.cmd = "increase strength 1";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 2;
        // Add eq1 on memory
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 1);
            assert.equal(DATA.players.get(player._id).strength, 1);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });

    // Test 5
    it('increase ok - vitality', (done) => {
        let data:any = {};
        data.cmd = "increase vitality 1";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add eq1 on memory
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(DATA.players.get(player._id).vitality, 1);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });


    // Test 6
    it('increase ko - You aren\'t connected, you can\'t use increase', (done) => {
        let data:any = {};
        data.cmd = "increase agility 1";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You aren't connected, you can't use increase");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 7
    it('increase ko - Bad info name', (done) => {
        let data:any = {};
        data.cmd = "increase badname 1";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add eq1 on memory
        DATA.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Bad info name");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 8
    it('increase ko - Insufficient points', (done) => {
        let data:any = {};
        data.cmd = "increase agility 2";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        player.availablePoint = 1;
        // Add eq1 on memory
        DATA.players.set(player._id, player);
        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Insufficient points");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

});