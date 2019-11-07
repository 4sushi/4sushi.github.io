const Historic = require('../common/historic')
const BackTesting = require('../common/backTesting').BackTesting
const Order = require('../common/backTesting').Order
const Util = require('../common/util')
const readline = require('readline')
const fs = require("fs")


class BtSimple extends BackTesting{

  constructor(){
    super();
    this.historic = null;

    this.pctBuy = -3
    this.pctSell = 0.1
    this.pctSellSecurity = -1
  }

  // No stockage in memory, proccess file line by line
  run(dir, callback){
    var tmpThis = this
    tmpThis.getFirstLineDir(dir, function(line){
      var firstTime = new Date(line[0]).getTime()
      tmpThis.historic = new Historic(firstTime)
      tmpThis.processFiles(dir, function(){
        return callback();
      });
    });
  }

  processFiles(dir, callback){
    var thisTmp = this;
    var files = thisTmp.getFilesDir(dir)
    var loopLoadFile = function(i, files){
      if(i == files.length){
        return callback();
      }
      thisTmp.processFile(files[i], function(){
        i++;
        loopLoadFile(i, files);
      });
    }
    loopLoadFile(0, files);
  }

  processFile(file, callback) {
    var thisTmp = this;
    var ignoreFirst = true;
    var first = true;
    var rl = readline.createInterface({
      input: fs.createReadStream(file),
    });
    rl.on('line', (line) => {
      if(first) {
        first = false
        return
      }
      this.processLine(line.split(','))
    });
    rl.on('close', () => {
      callback();
    });
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

  var backTesting = new BtSimple()

  var used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory : ${Math.round(used * 100) / 100} MB`);
  console.time('main');
  console.log(backTesting.brokerValue())
  backTesting.run('/home/sushi/data/crypto/binance/sec/ETHBTC', ()=>{
    console.log(backTesting.brokerValue())
    console.timeEnd('main')
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory : ${Math.round(usedEnd * 100) / 100} MB`);
  })

}();
