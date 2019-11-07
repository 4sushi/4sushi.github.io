"use strict";
/**
 * Created by sushi on 15/09/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var assert = require("assert");
var mainIT_1 = require("../../mainIT");
var profil_1 = require("../../../../../src/server/profil");
describe('loginIT', function () {
    var mainIT = new mainIT_1.MainIT();
    // Test 1
    var TEST1_ACCOUNT_EMAIL = "emaildetest1@test.com";
    var TEST1_ACCOUNT_PASSWORD = "Password123&";
    var TEST1_ACCOUNT_ID = mongoose.Types.ObjectId();
    var TEST1_PLAYER_ID = mongoose.Types.ObjectId();
    mainIT.addInsertBeforeDataSet("account", { _id: TEST1_ACCOUNT_ID, email: TEST1_ACCOUNT_EMAIL, password: TEST1_ACCOUNT_PASSWORD, _player: TEST1_PLAYER_ID });
    mainIT.addInsertBeforeDataSet("player", { _id: TEST1_PLAYER_ID, name: "loginTest", mapKey: "1:1" });
    mainIT.addDeleteAfterDataSet("account", { _id: TEST1_ACCOUNT_ID });
    mainIT.addDeleteAfterDataSet("player", { _id: TEST1_PLAYER_ID });
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
    it('login ok', function (done) {
        var data = {};
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.equal(responseGame.code, 0);
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 2
    it('login ko - Invalid email format', function (done) {
        var data = {};
        data.cmd = "login bademailformat Password123&";
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email format");
            done();
        })
            .catch(function (e) {
            done(e);
        });
    });
    // Test 3
    // Bad password
    it('login ko - Invalid email or password', function (done) {
        var data = {};
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " badpassword";
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email or password");
            done();
        })
            .catch(function (e) {
            done(e);
        });
    });
    // Test 4
    // Bad email
    it('login ko - Invalid email or password', function (done) {
        var data = {};
        data.cmd = "login bademail@gmail.com " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, new profil_1.Profil()).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "Invalid email or password");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
    // Test 5
    it('login ko - You are already connected', function (done) {
        var data = {};
        // Init connect profil
        var profil = new profil_1.Profil();
        profil.playerId = "1";
        data.cmd = "login " + TEST1_ACCOUNT_EMAIL + " " + TEST1_ACCOUNT_PASSWORD;
        mainIT.server.evtCmd(data, profil).then(function (responseGame) {
            assert.notEqual(responseGame.code, 0);
            assert.equal(responseGame.data, "You are already connected");
            done();
        }).catch(function (e) {
            done(e);
        });
    });
});
