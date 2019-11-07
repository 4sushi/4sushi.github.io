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
import DATA from "../../../../../src/server/data";

describe('logoutIT', () => {

    var mainIT : MainIT = new MainIT();

    // Test 1
    const TEST1_PLAYER_ID:mongoose.Types.ObjectId = mongoose.Types.ObjectId();
    mainIT.addDeleteAfterDataSet("eq1", {_id : TEST1_PLAYER_ID});

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
    it('logout ok', (done) => {
        let data:any = {};
        data.cmd = "logout";
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = TEST1_PLAYER_ID.toHexString();
        // Init eq1
        let player:Player = new Player();
        player._id = TEST1_PLAYER_ID.toHexString();
        player.cellKey = Cell.generateKey(1,1);
        // Add eq1 on the map
        DATA.world.connectionPlayer(player);
        DATA.players.set(player._id, player);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });


    // Test 2
    it('logout ko - You aren\'t connected, you can\'t use logout', (done) => {
        let data:any = {};
        data.cmd = "logout";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You aren't connected, you can't use logout");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

});