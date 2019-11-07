/**
 * Created by sushi on 18/10/17.
 */

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
import {GroupMonster} from "../../../../../src/model/world/groupMonster";
import {Monster} from "../../../../../src/model/character/monster";

describe('attackIT', () => {

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
    it('attack ok', (done) => {

        let gpM:GroupMonster = new GroupMonster();
        gpM._id = "1";
        let monster1 = new Monster();
        monster1.agility = 1;
        monster1.resistance = 1;
        monster1.speed = 1;
        monster1.strength = 1;
        monster1.vitality = 1;
        monster1.rateCH = 50;
        monster1.damageCH = 10;
        monster1.minDamage = 5;
        monster1.maxDamage = 6;
        monster1.life = 20;
        monster1.lifeMax = 20;
        gpM.monsters.push(monster1);


        let data:any = {};
        data.cmd = "attack 1";
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

        DATA.world.maps.get(player.cellKey).groupMonsters.set(gpM._id, gpM);

        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            assert.equal(responseGame.data.availablePoint, 0);
            assert.equal(DATA.players.get(player._id).agility, 1);
            done();
        }).catch((e:any) => {
            done(e)
        });

    });

});