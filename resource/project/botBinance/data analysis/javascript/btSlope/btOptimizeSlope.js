const Historic = require('../common/historic')
const Backtesting = require('../common/backTesting').BackTesting
const Order = require('../common/backTesting').Order
const Util = require('../common/util')
const readline = require('readline')
const fs = require("fs")


class BtOptimizeSlope extends Backtesting{

  constructor(){
    super();
    this.historic = null;

    this.dicoSlope = [];
    this.dicoSlopeAll = [
      {inf : -1000, sup : -0.128, pctBuy : -1, pctSell : 1, pctSellSecurity : -3},
      {inf : -0.128, sup : -0.032, pctBuy : -1, pctSell : 0.75, pctSellSecurity : -2},
      {inf : -0.032, sup : 0.044, pctBuy : -0.5, pctSell : 0.75, pctSellSecurity : -2},
      {inf : 0.044, sup : 0.137, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -2},
      {inf : 0.137, sup : 1000, pctBuy : -0.5, pctSell : 0.25, pctSellSecurity : -3}
    ]
  }

  init(){
    this.mode = "WAIT_SLOPE" // special mode for slope optimize
    this.transactionTime = 0;
    this.order = null;
    this.buyPrice = null;
    this.broker.cash = 0.1;
    this.broker.portfolio = {'ETHBTC' : 0};
    this.broker.lastPrices = {'ETHBTC' : 0};

		this.pricesSlop = [];
		this.pricesSlopLastUpdate = 0;
		this.intervalPctRefresh = 10; // minutes
    this.slopePricesForSmooth = [];
    this.slopeNbsmooth = 10

  }

  run(dir, callback){
    var tmpThis = this;
    tmpThis.loadFiles(dir, function(){
      var resultats = tmpThis.optimize();
      return callback(resultats);
    });
  }

  optimize(){
    var resultatsAll = [];
    for(var iDicoSlopeAll in this.dicoSlopeAll){
      this.dicoSlope = [];
      this.dicoSlope.push(this.dicoSlopeAll[iDicoSlopeAll]);
      var resultats = [];
      for(var pctBuy of [-0.25, -0.5, -1, -2, -3]){ // [-0.25, -0.5, -0.75, -1]
        for(var pctSell of [0.25, 0.5, 0.75, 1]){
          for(var pctSellSecurity of [-1, -2, -3]){
            this.dicoSlope[0].pctBuy = pctBuy, this.dicoSlope[0].pctSell = pctSell, this.dicoSlope[0].pctSellSecurity = pctSellSecurity
            this.init()
            this.historic = new Historic(new Date(this.lines[0][0]).getTime())
            this.process(this.lines)
            var resultat = {
              inf : this.dicoSlopeAll[iDicoSlopeAll].inf,
              sup : this.dicoSlopeAll[iDicoSlopeAll].sup,
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
      //var top10 = resultats.slice(0,10)
      //resultatsAll = resultatsAll.concat(resultats)
      resultatsAll.push(resultats[0])
      console.log(resultats[0])
    }
    return resultatsAll;
  }

  process(linesPeriod){
    var length = linesPeriod.length;
    for(var i=0; i < length; i++){
      this.processLine(linesPeriod[i])
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
     this.pricesSlop.unshift(priceSmooth);
     if(this.mode === 'LISTEN_BUY' || this.mode === 'WAIT_SLOPE' ){
       // Enough price to calculate slope
       if(this.pricesSlop.length === this.intervalPctRefresh){
         var firstPrice = this.pricesSlop[this.intervalPctRefresh-1]
         var lastPrice = this.pricesSlop[0]
         var slope = Util.pctEvol(firstPrice, lastPrice)
         var find = false;
         for(var dico of this.dicoSlope){
           if(slope > dico.inf && slope <= dico.sup){
             this.pctBuy = dico.pctBuy
             this.pctSell = dico.pctSell
             this.pctSellSecurity = dico.pctSellSecurity
             find = true
           }
         }
         if(find){
          this.mode = 'LISTEN_BUY'
        }else{
          this.mode = 'WAIT_SLOPE'
        }

       }
     }
     this.pricesSlopLastUpdate = time
   }
	}



}

var main = function(){

  var backTesting = new BtOptimizeSlope();

  var used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory : ${Math.round(used * 100) / 100} MB`);
  console.time('main');
  console.log(backTesting.brokerValue());
  backTesting.run('/home/sushi/data/crypto/binance/sec/15231096_15237180/XRPBTC', (resultats)=>{
    console.log(resultats)
    var usedEnd = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory : ${Math.round(usedEnd * 100) / 100} MB`);
    var win = 0;
    for(var res of resultats){
      win += res.value - 0.1
    }
    console.log("WIN", win, "BTC")
  })

}();
