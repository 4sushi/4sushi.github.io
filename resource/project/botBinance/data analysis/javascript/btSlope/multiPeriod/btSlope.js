const Historic = require('../common/historic')
const BackTesting = require('../common/backTesting').BackTesting
const Order = require('../common/backTesting').Order
const Util = require('../common/util')
const readline = require('readline')
const fs = require("fs")


class BtSlope extends BackTesting{

  constructor(){
    super();
    this.historic = null;

    this.pctBuy = -1
    this.pctSell = 1
    this.pctSellSecurity = -3

  	this.pricesSlop = []
  	this.tmp = []
  	this.pricesSlopLastUpdate = 0
  	this.intervalPctRefresh = 10 // minutes
  	this.dicoSlope = [
  		{inf : -1000, sup : -0.139, pctBuy : -1, pctSell : 1, pctSellSecurity : -3},
      {inf : -0.139, sup : -0.036, pctBuy : -1, pctSell : 0.75, pctSellSecurity : -2},
      {inf : -0.036, sup : 0.040, pctBuy : -0.5, pctSell : 0.75, pctSellSecurity : -2},
      {inf : 0.040, sup : 0.137, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -2},
      {inf : 0.137, sup : 1000, pctBuy : -0.5, pctSell : 0.25, pctSellSecurity : -3}
  	]
    this.slopePricesForSmooth = []
    this.slopeNbsmooth = 10

    this.lastTime = null
  }

  changePeriod(time){
    this.pctBuy = -1
    this.pctSell = 1
    this.pctSellSecurity = -3

    this.pricesSlop = []
    this.pricesSlopLastUpdate = time
    this.slopePricesForSmooth = []
    this.historic.setDefault()

    if(this.order){
      this.broker.cash += this.order.price * (this.order.quantity - this.order.qtExecuted) * (1 - this.broker.sellFees / 100)
    }
    this.mode = "LISTEN_BUY"
    this.order = null;
    this.transactionTime = null
    this.buyPrice = null;
    this.broker.portfolio = {'ETHBTC' : 0}
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

    // Change period
    // TODO supp
    if(this.lastTime && time > this.lastTime + 1000 * 60 * 60 * 24){
      console.log('change period')

      this.changePeriod(time)
    }
    this.lastTime = time

    this.broker.lastPrices[name] = price
    if(this.order){
      this.order.update(date, price, quantity)
    }

    this.historic.update(price, time)
		this.updateStrategy(price, time, quantity)

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

  updateStrategy(price, time, quantity){

    // Refresh values to calculate slope every minute
    if(time > this.pricesSlopLastUpdate + 1000 * 60){

      this.slopePricesForSmooth.push(price)
      if(this.slopePricesForSmooth.length < this.slopeNbsmooth){
        return
      }
      var sum = 0;
      for(var i=0, n=this.slopePricesForSmooth.length; i < n; i++)
      {
         sum += this.slopePricesForSmooth[i];
      }
      var priceSmooth = sum / this.slopePricesForSmooth.length
      this.slopePricesForSmooth = []

      if(this.pricesSlop.length == this.intervalPctRefresh){
          this.pricesSlop.pop(); // Retire dernier élément
      }
      this.pricesSlop.unshift(priceSmooth)
			if(this.mode == 'LISTEN_BUY'){
				// Enough price to calculate slope
				if(this.pricesSlop.length == this.intervalPctRefresh){
					var firstPrice = this.pricesSlop[this.intervalPctRefresh-1]
					var lastPrice = this.pricesSlop[0]
					var slope = Util.pctEvol(firstPrice, lastPrice)
					this.tmp.push(slope)
					for(var dico of this.dicoSlope){
						if(slope > dico.inf && slope <= dico.sup){
							this.pctBuy = dico.pctBuy
							this.pctSell = dico.pctSell
							this.pctSellSecurity = dico.pctSellSecurity
						}
					}
				}
			}
      this.pricesSlopLastUpdate = time
    }
	}


}

var main = function(){

  var backTesting = new BtSlope()

  var used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory : ${Math.round(used * 100) / 100} MB`);
  console.time('main');
  console.log(backTesting.brokerValue())
  backTesting.run('/home/sushi/data/crypto/binance/sec/ETHBTC_3P', ()=>{
    var nb = Math.floor(backTesting.tmp.length / 5)
    backTesting.tmp = backTesting.tmp.sort((a,b)=> a - b)
    for(var i =0; i < 5; i++){
      console.log(i *nb, ((i+1)*nb)-1, backTesting.tmp.length)
      console.log(backTesting.tmp[i*nb], backTesting.tmp[((i+1)*nb)-1])
    }
    backTesting.tmp = backTesting.tmp.sort((a,b)=>{return a - b})
    console.log(backTesting.brokerValue())
    console.timeEnd('main')
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory : ${Math.round(usedEnd * 100) / 100} MB`);
  })

}();
