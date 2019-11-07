/**
 * Created by sushi on 15/09/17.
 */

import { suite, test } from "mocha-typescript";
import * as mongoose from "mongoose";
import * as assert from "assert";
import {MainIT} from "../../mainIT";
import {fail} from "assert";
import {ResponseGame} from "../../../../../src/controller/exchange/responseGame";
import {Profile} from "../../../../../src/server/profile";

describe('loginIT', () => {

    var mainIT : MainIT = new MainIT();

    // Test 1
    const TEST1_ACCOUNT_EMAIL:string = "emaildetest1@test.com";
    const TEST1_ACCOUNT_PASSWORD:string = "Password123&";
    const TEST1_ACCOUNT_ID:mongoose.Types.ObjectId = mongoose.Types.ObjectId();
    const TEST1_PLAYER_ID:mongoose.Types.ObjectId = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("account", {_id : TEST1_ACCOUNT_ID, email : TEST1_ACCOUNT_EMAIL, password : TEST1_ACCOUNT_PASSWORD, _player : TEST1_PLAYER_ID});
    mainIT.addInsertBeforeDataSet("eq1", {_id : TEST1_PLAYER_ID, name : "loginTest", cellKey : "1:1"});
    mainIT.addDeleteAfterDataSet("account", {_id : TEST1_ACCOUNT_ID});
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
    it('login ok', (done) => {
        let data:any = {};
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 2
    it('login ko - Invalid email format', (done) => {
        let data:any = {};
        data.cmd = "login bademailformat Password123&";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email format");
            done();
        })
            .catch((e:Error) => {
                done(e);
            });
    });

    // Test 3
    // Bad password
    it('login ko - Invalid email or password', (done) => {
        let data:any = {};
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " badpassword";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email or password");
            done();
        })
            .catch((e:Error) => {
                done(e);
            });
    });

    // Test 4
    // Bad email
    it('login ko - Invalid email or password', (done) => {
        let data:any = {};
        data.cmd = "login bademail@gmail.com " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email or password");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 5
    it('login ko - You are already connected', (done) => {
        let data:any = {};
        // Init connect profile
        let profil:Profile = new Profile();
        profil._player = "1";
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You are already connected");
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

});