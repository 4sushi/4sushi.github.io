const Historic = require('../common/historic')
const Backtesting = require('../common/backTesting').BackTesting
const Order = require('../common/backTesting').Order
const Util = require('../common/util')
const readline = require('readline')
const fs = require("fs")


class BtOptimize extends Backtesting{

  constructor(){
    super();
    this.historic = null;

  }

  init(){
    this.mode = "LISTEN_BUY"
    this.transactionTime = 0
    this.order = null
    this.buyPrice = null
    this.broker.cash = 0.1;
    this.broker.portfolio = {'ETHBTC' : 0}
    this.broker.lastPrices = {'ETHBTC' : 0}
  }

  run(dir, callback){
    var tmpThis = this
    tmpThis.getFirstLineDir(dir, function(line){
      var firstTime = new Date(line[0]).getTime()
      tmpThis.loadFiles(dir, function(){
        var resultats = tmpThis.optimize(firstTime)
        return callback(resultats);
      });
    });
  }

  optimize(firstTime){
    var resultats = [];
    for(var pctBuy of [-0.25, -0.5, -1, -2, -3, -4]){ // [-0.25, -0.5, -0.75, -1]
      for(var pctSell of [0.25, 0.5, 0.75, 1]){
        for(var pctSellSecurity of [-1, -2, -3]){
          this.pctBuy = pctBuy, this.pctSell = pctSell, this.pctSellSecurity = pctSellSecurity
          this.init()
          this.historic = new Historic(firstTime)
          this.process()
          var resultat = {
            pctBuy : pctBuy,
            pctSell : pctSell,
            pctSellSecurity : pctSellSecurity,
            value : this.brokerValue()
          }
          resultats.push(resultat);
        }
      }
    }
    resultats.sort(function (a, b) {
      return b.value - a.value;
    });
    return resultats;
  }

  process(){
    var length = this.lines.length;
    for(var i=0; i < length; i++){
      this.processLine(this.lines[i])
    }
  }

  processLine(line){

    var name = "ETHBTC"
    var date = new Date(line[0]);
    var time = date.getTime()
    var price = parseFloat(line[1]);
    var quantity = parseFloat(line[2]);

    this.broker.lastPrices[name] = price
    if(this.order){
      this.order.update(date, price, quantity)
    }

    this.historic.update(price, time)

    if(this.mode == "LISTEN_BUY"){
      if(time < this.transactionTime + 1000) return
      var pctEvol = Util.pctEvol(this.historic.getMax60seconds(), price);
      if(pctEvol <= this.pctBuy){
          this.mode = "WAIT_BUY"
          this.historic.setDefault();
          this.transactionTime = time
      }
    }
    else if(this.mode == "WAIT_BUY"){
      if(time < this.transactionTime + 1000) return
      this.mode = "BUY"
      this.order = this.buyLimit(name, date, price);
      this.buyPrice = this.order.price
    }
    else if(this.mode == "BUY"){
      if(this.order.status == Order.STATUS().FILLED){
          this.mode = "WAIT_SELL"
          this.transactionTime = time
      }
      else if(time > this.transactionTime + 10000){
        if(this.order.status == Order.STATUS().PARTIALLY_FILLED){
          this.cancelOrder(this.order, date)
          this.order = null
          this.mode = "WAIT_SELL"
          this.transactionTime = time
        }else{
          this.historic.setDefault();
          this.cancelOrder(this.order, date)
          this.order = null
          this.mode = "LISTEN_BUY"
          this.transactionTime = time
        }
      }
    }
    else if(this.mode == "WAIT_SELL"){
      if(time < this.transactionTime + 1000) return
      this.mode = "SELL"
      var sellPrice = Util.floor(this.buyPrice* (1+this.pctSell/100), 8);
      this.order = this.sellLimit(name, date, sellPrice);
    }
    else if(this.mode == "SELL"){
      if(this.order.status == Order.STATUS().FILLED){
        this.mode = "LISTEN_BUY"
        this.order = null;
        this.historic.setDefault();
      }
      else{
        var pctEvol = Util.pctEvol(this.order.price, price);
        if(pctEvol <= this.pctSellSecurity){
          this.cancelOrder(this.order, date)
          this.order = null
          this.transactionTime = time
          this.mode = "WAIT_SELL_SECURITY"
        }
      }
    }
    else if(this.mode == "WAIT_SELL_SECURITY"){
      if(time < this.transactionTime + 1000) return
      this.mode = "SELL_SECURITY"
      this.order = this.sellMarket(name, date);
    }else if(this.mode =="SELL_SECURITY"){
      if(this.order.status == Order.STATUS().FILLED){
          this.mode = "LISTEN_BUY"
          this.order = null;
          this.historic.setDefault();
      }
    }

  }

}

var main = function(){

  var backTesting = new BtOptimize()

  var used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory : ${Math.round(used * 100) / 100} MB`);
  console.time('main');
  console.log(backTesting.brokerValue())
  backTesting.run('/home/sushi/data/crypto/binance/sec/15231096_15237180/ETHUSDT', (resultats)=>{
    console.log(resultats)
    console.timeEnd('main')
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory : ${Math.round(usedEnd * 100) / 100} MB`);
  })

}();
