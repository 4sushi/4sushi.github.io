const fs = require("fs")
const path = require("path")
const readline = require('readline')
const shortid = require('shortid')
const Historic = require('../common/historic')
const BackTesting = require('../common/backTesting').BackTesting
const Order = require('../common/backTesting').Order
const Util = require('../common/util')
const Optimizer = require('./optimizer')



class BtLearn extends BackTesting{

  constructor(){
    super()

    this.pctBuy = -2;
    this.pctSell = 0.5;
    this.pctSellSecurity = -2;
    this.pctBuyOpti = null;
    this.pctSellOpti = null;
    this.pctSellSecurityOpti = null;
    this.isPctOptiChange = false;
    this.aSupValue = null
    this.lastUpdate = null;
    // TODO decommenter pour le bot this.lastUpdate = firstTime;
    // TODO decommenter pour le bot this.file = fs.createWriteStream('files/'+this.lastUpdate +'.txt');
    this.optimizer = new Optimizer();
  }

  run(dir, callback){
    var tmpThis = this
    tmpThis.getFirstLineDir(dir, function(line){
      var firstTime = new Date(line[0]).getTime()
      tmpThis.lastUpdate = firstTime
      tmpThis.historic = new Historic(firstTime);
      tmpThis.file = fs.createWriteStream('files/'+tmpThis.lastUpdate +'.txt');
      tmpThis.loadFiles(dir, function(){
        tmpThis.process(function(){
          // Remove last file
          fs.unlinkSync('files/'+tmpThis.lastUpdate +'.txt');
          console.log('end run')
          return callback();
        })
      })
    });
  }

  process(callback){
    var length = this.lines.length;
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    var tmpThis = this;
    var processLineLoop = function(i){
      if(i == length){
        console.log('end process', i, length)
        return callback();
      }
      // https://stackoverflow.com/questions/20936486/node-js-maximum-call-stack-size-exceeded
      // https://blog.jcoglan.com/2010/08/30/the-potentially-asynchronous-loop/
      if( i % 100 === 0 ) { // if( i % 1000 === 0 ) {
          setTimeout( function() {
            tmpThis.processLine(tmpThis.lines[i], function(){
              processLineLoop(i+1)
            })
          }, 10 );
      } else {
        tmpThis.processLine( tmpThis.lines[i], function(){
          processLineLoop(i+1)
        })
      }
    }
    processLineLoop(0);
  }

  processLine(line, callback){

    var name = "ETHBTC"
    var date = new Date(line[0]);
    var time = date.getTime()
    var price = parseFloat(line[1]);
    var quantity = parseFloat(line[2]);

    this.broker.lastPrices[name] = price

    if(this.order){
      this.order.update(date, price, quantity)
    }

    if(this.isPctOptiChange && this.mode == "LISTEN_BUY"){
      this.isPctOptiChange = false
      this.pctBuy = this.pctBuyOpti;
      this.pctSell = this.pctSellOpti;
      this.pctSellSecurity = this.pctSellSecurityOpti;
    }

    // TODO ne pas mettre le callback sur le bot
    this.updateStrategy(price, time, quantity, ()=>{

      if(this.mode == "LISTEN_BUY"){
        if(time < this.transactionTime + 1000) return callback()
        var pctEvol = Util.pctEvol(this.historic.getMax60seconds(), price);
        if(pctEvol <= this.pctBuy){
            this.mode = "WAIT_BUY"
            this.historic.setDefault();
            this.transactionTime = time
        }
      }
      else if(this.mode == "WAIT_BUY"){
        if(time < this.transactionTime + 1000) return callback();
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
            this.cancelOrder(this.order, date)
            this.order = null
            this.mode = "LISTEN_BUY"
            this.transactionTime = time
          }
        }
      }
      else if(this.mode == "WAIT_SELL"){
        if(time < this.transactionTime + 1000) return callback();
        this.mode = "SELL"
        var sellPrice = Util.floor(this.buyPrice * (1+this.pctSell/100), 8);
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
        if(time < this.transactionTime + 1000) return callback();
        this.mode = "SELL_SECURITY"
        this.order = this.sellMarket(name, date);
      }
      else if(this.mode =="SELL_SECURITY"){
        if(this.order.status == Order.STATUS().FILLED){
            this.mode = "LISTEN_BUY"
            this.order = null;
        }
      }
      return callback();
    })

  }

  updateStrategy(price, time, quantity, callback){
      this.historic.update(price, time)
      this.file.write(time+','+price+','+quantity+'\n');
      if(time >= this.lastUpdate + 1000 * 60 * 60){
        var fileName = 'files/'+this.lastUpdate.toString()+'.txt'
        this.file.end();
        this.lastUpdate = time;
        this.file = fs.createWriteStream('files/'+this.lastUpdate.toString()+'.txt');
        this.optimizer.run(fileName, (res)=>{
          fs.unlinkSync(fileName); // remove file
          this.pctBuyOpti = res.pctBuy;
          this.pctSellOpti = res.pctSell;
          this.pctSellSecurityOpti = res.pctSellSecurity;
          this.aSupValue = res.value
          this.isPctOptiChange = true;
          return callback()
        })
      }
      else{
        return callback()
      }
  }

}

var main = function(){

  var backTesting = new BtLearn();

  var used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory : ${Math.round(used * 100) / 100} MB`);
  console.time('main');
  console.log(backTesting.brokerValue())
  backTesting.run('../../data/sec/ETHBTC2', ()=>{
    console.log(backTesting.brokerValue())
    console.timeEnd('main')
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory : ${Math.round(usedEnd * 100) / 100} MB`);
  })

}();
