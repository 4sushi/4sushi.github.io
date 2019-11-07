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

describe('characteristicIT', () => {

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
    it('info ok', (done) => {
        let data:any = {};
        data.cmd = "info";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = DataBase.generateId();
        // Init eq1
        let player:Player = new Player();
        player._id = profil.playerId;
        player.setDefault();
        // Add eq1 on the map
        DATA.players.set(player._id, player);


        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.agility, 0);
            assert.equal(responseGame.data.resistance, 0);
            assert.equal(responseGame.data.speed, 0);
            assert.equal(responseGame.data.strength, 0);
            assert.equal(responseGame.data.vitality, 0);
            assert.equal(responseGame.data.agility, 0);
            assert.equal(responseGame.data.resistance, 0);
            assert.equal(responseGame.data.speed, 0);
            assert.equal(responseGame.data.strength, 0);
            assert.equal(responseGame.data.vitality, 0);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });


    // Test 2
    it('info ko - You aren\'t connected, you can\'t use info', (done) => {
        let data:any = {};
        data.cmd = "info";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You aren't connected, you can't use info");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

});