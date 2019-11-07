/**
 * Created by sushi on 31/05/17.
 */
import { suite, test } from "mocha-typescript";
import * as mongoose from "mongoose";
import * as assert from "assert";
import {MainIT} from "../../mainIT";
import {fail} from "assert";
import {ResponseGame} from "../../../../../src/controller/exchange/responseGame";
import {Profile} from "../../../../../src/server/profile";

describe('signupIT', () => {

    var mainIT : MainIT = new MainIT();

    // Test 1
    const TEST1_PLAYER_NAME:string = "playernamedetestun";
    const TEST1_ACCOUNT_EMAIL:string = "emaildetest@test.com";
    mainIT.addDeleteAfterDataSet("eq1", {name : TEST1_PLAYER_NAME});
    mainIT.addDeleteAfterDataSet("account", {email : TEST1_ACCOUNT_EMAIL});

    // Test 5
    const TEST5_ACCOUNT_EMAIL:string = "emaildetest5@test.com";
    mainIT.addInsertBeforeDataSet("account", {email : TEST5_ACCOUNT_EMAIL});
    mainIT.addDeleteAfterDataSet("account", {email : TEST5_ACCOUNT_EMAIL});

    // Test 6
    const TEST6_PLAYER_NAME:string = "playernamedetestsix";
    mainIT.addInsertBeforeDataSet("eq1", {name : TEST6_PLAYER_NAME});
    mainIT.addDeleteAfterDataSet("eq1", {name : TEST6_PLAYER_NAME});


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
    it('signup ok', (done) => {
        let data:any = {};
        data.cmd = "signup " + TEST1_PLAYER_NAME + " " + TEST1_ACCOUNT_EMAIL + " Password123& Password123&";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.equal(responseGame.code, 0);
            done();
        }).catch((e:any) => {
            done(e)
        });
    });

    // Test 2
    it('signup ko - Invalid email format', (done) => {
        let data:any = {};
        data.cmd = "signup yokko martin@@gmail.com Password123& Password123&";
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
    it('signup ko - Invalid password format', (done) => {
        let data:any = {};
        data.cmd = "signup yokko martin@gmail.com Password Password";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid password format");
            done();
        })
        .catch((e:Error) => {
            done(e);
        });
    });

    // Test 4
    it('signup ko - Passwords aren\'t identical', (done) => {
        let data:any = {};
        data.cmd = "signup yokko martin@gmail.com Password123& Password456&";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Passwords aren\'t identical");
            done();
        })
        .catch((e:Error) => {
            done(e);
        });
    });

    // Test 5
    it('signup ko - Email is already used', (done) => {
        let data:any = {};
        data.cmd = "signup playernamedetestcinq " + TEST5_ACCOUNT_EMAIL + " Password123& Password123&";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Email is already used");
            done();
        })
        .catch((e:Error) => {
            done(e);
        });
    });

    // Test 6
    it('signup ko - Player name is already used', (done) => {
        let data:any = {};
        data.cmd = "signup " + TEST6_PLAYER_NAME + " martin@gmail.com Password123& Password123&";
        mainIT.server.evtCmd(data, new Profile()).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Player name is already used");
            done();
        })
            .catch((e:Error) => {
                done(e);
            });
    });

    // Test 7
    it('signup ko - You are connected, you can\'t use signup', (done) => {
        let data:any = {};
        // Init connect profile
        let profil:Profile = new Profile();
        profil.playerId = "1";
        data.cmd = "signup playertestsept martin@gmail.com Password123& Password123&";
        mainIT.server.evtCmd(data, profil).then((responseGame:ResponseGame)=>{
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You are connected, you can't use signup");
            done();
        })
            .catch((e:Error) => {
                done(e);
            });
    });

});