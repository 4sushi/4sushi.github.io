// Libs
const { exec } = require('child_process');
var colors = require('colors');

const util = require('./util');
let Historic = require('./historic');
let Binance = require('./binance');
let slopes = require('./slope');
const Logger = require('./logger');


/**************************/
/*      BotManager        */
/**************************/

function BotManager() {
    this.symbols = ['ETHBTC', 'LTCBTC', 'NANOBTC', 'ICXBTC', 'TRXBTC'];
    // this.symbols = ['ETHBTC', 'LTCBTC', 'BTCUSDT', 'NANOBTC', 'ICXBTC', 'TRXBTC'];
    this.binance = new Binance(this.symbols);
    this.strategies = {};
    this.nbOrder = 0;
    this.nbOrderMax = 2;
    for (let i = 0; i < this.symbols.length; i++) {
        let symbol = this.symbols[i];
        this.strategies[symbol] = new Strategy(symbol, this)
    }
}

BotManager.prototype.init = function(){
    Logger.log('info', 'start bot');
    this.binance.init(this, ()=>{});

    process.on('SIGINT', function() {
        Logger.log('info', 'stop bot');
        exec('spd-say "ERROR"');
        process.exit();
    });
};

BotManager.prototype.eventNewTransaction = function(symbol, currentTradePrice, currentTradeTime){
    let strategy = this.strategies[symbol];
    strategy.eventNewTransaction(currentTradePrice, currentTradeTime);
};

BotManager.prototype.eventUpdateTrade = function(symbol, price, quantity, qtExecuted, orderStatus){
    let strategy = this.strategies[symbol];
    strategy.eventUpdateTrade(price, quantity, qtExecuted, orderStatus);
};

/**************************/
/*       Strategy         */
/**************************/

function Strategy(symbol, botManager) {

    this.symbol = symbol;
    this.botManager = botManager;
    this.binance = botManager.binance;
    this.historic = new Historic();
    this.mode = this.MODE().LISTEN_BUY ; // {LISTEN_BUY, TRY_BUY, WAIT_SELL, TRY_SELL}
    this.buyQt = null; // number
    this.buyPrice = null; // number
    this.sellOrderId = null; // number
    this.sellExecutedQty = 0;

    this.pctBuy = -3;
    this.pctSell = 0.25;
    this.pctSellSecurity = -2;

    this.slope = {};
    this.slope.historyPrices = []; // array<number>
    this.slope.lastUpdate = 0; // timestamp
    this.slope.intervalRefresh = 10; // number
    this.slope.pctBySlope = slopes[symbol];
    this.slope.pricesForSmooth = [];
    this.slope.nbPricesForSmooth = 10;
}

Strategy.prototype.eventNewTransaction = function(currentTradePrice, currentTradeTime){

    this.historic.update(currentTradePrice, currentTradeTime);
    this.updateStrategy(currentTradePrice, currentTradeTime);
    if(this.mode === this.MODE().LISTEN_BUY && this.botManager.nbOrder < this.botManager.nbOrderMax){
        this.buyStrategy(currentTradePrice, new Date(currentTradeTime));
    }
    else if(this.mode === this.MODE().TRY_SELL){
        this.sellSecurityStrategy(currentTradePrice, new Date(currentTradeTime));
    }
    else{ // this.mode == "WAIT"
        // On ne fait rien
    }
};

Strategy.prototype.buyStrategy = function(price, date){

    if(this.historic.getMax60seconds() > 0){
        let pctEvol = util.pctEvol(this.historic.getMax60seconds(), price);
        if(pctEvol <= this.pctBuy){
            Logger.log('info', `TRY ORDER BUY : ${this.symbol} pctBuy=${this.pctBuy} pctSell=${this.pctSell}`);
            this.buy(price, date, this.historic.getMax60seconds(), pctEvol);
            this.historic.setDefault();
        }
    }
};

Strategy.prototype.sellSecurityStrategy = function(price, date){
    let pctEvol = util.pctEvol(this.buyPrice, price);
    if(pctEvol <= this.pctSellSecurity){
        this.sellSecurity(price, pctEvol, ()=>{});
    }
};

Strategy.prototype.buy = function(price, datePrice, oldPrice, pctEvol){

    let tmpThis = this;
    Logger.log('debug', `Bot.prototype.buy : symbol=${tmpThis.symbol} price=${price} datePrice=${util.formatDateSec(datePrice)} oldPrice=${oldPrice} pctEvol=${pctEvol}`);

    tmpThis.mode = tmpThis.MODE().TRY_BUY;
    let qtAsk = null;
    tmpThis.botManager.nbOrder++;

    let buyLimit = function(){
        tmpThis.binance.buyLimit(tmpThis.symbol, price, (orderId, quantity)=>{
            Logger.log('info', `ORDER BUY : symbol=${tmpThis.symbol} price=${price} quantity=${quantity}`);
            qtAsk = quantity;
            setTimeout(()=>{
                waitBuyLimit(orderId)
            }, 1000*20);
        })
    };
    let waitBuyLimit = function(orderId){

        if(tmpThis.mode === tmpThis.MODE().TRY_BUY){
            cancelOrder(orderId);
        }
        //else
            // gerer dans event update trade
        // }
    };
    let cancelOrder = function(orderId){
        Logger.log('info', `ORDER CANCEL symbol=${tmpThis.symbol}`);
        tmpThis.binance.cancelOrder(tmpThis.symbol, orderId, ()=>{
            getBalance();
        });
    };
    let getBalance = function(){
        tmpThis.binance.getBalance(tmpThis.symbol, (qtAvailable)=>{
            if(qtAvailable === 0){
                Logger.log('info', `CANCEL symbol=${tmpThis.symbol}`);
                tmpThis.mode = tmpThis.MODE().LISTEN_BUY;
                tmpThis.botManager.nbOrder--;
            }else{
                buyDone(qtAvailable);
            }
        });
    };
    let buyDone = function(qtBuy){
        Logger.log('info', `BUY : ${tmpThis.symbol} qtBuy/qtAsk=${qtBuy}/${qtAsk}`);
        tmpThis.buyQt = qtBuy;
        tmpThis.buyPrice = price;
        tmpThis.sell();
    };
    buyLimit();
};



Strategy.prototype.sell = function(){

    let tmpThis = this;
    Logger.log('debug', `Bot.prototype.sell : symbol=${tmpThis.symbol}`);

    tmpThis.mode = tmpThis.MODE().WAIT_SELL;
    let sellPrice = tmpThis.buyPrice* (1 + tmpThis.pctSell/100);
    tmpThis.sellExecutedQty = 0;
    tmpThis.binance.sellLimit(tmpThis.symbol, tmpThis.buyQt, sellPrice, (orderId)=>{
        Logger.log('info', `ORDER SELL : ${tmpThis.symbol} sellPrice=${sellPrice}`);
        tmpThis.mode = tmpThis.MODE().TRY_SELL;
        tmpThis.sellOrderId = orderId;
    })

};

Strategy.prototype.sellSecurity = function(currentPrice, pctEvol){

    let tmpThis = this;
    Logger.log('debug', `Bot.prototype.sellSecurity : symbol=${tmpThis.symbol} currentPrice=${currentPrice} pctEvol=${pctEvol}`);

    tmpThis.mode = tmpThis.MODE().WAIT_SELL;

    let cancelOrder = function(){
        Logger.log('info', `ORDER SELL SECURITY : ${tmpThis.symbol} sellOrderId=${tmpThis.sellOrderId}`);
        tmpThis.binance.cancelOrder(tmpThis.symbol, tmpThis.sellOrderId, ()=>{
            let qtSell = tmpThis.buyQt - tmpThis.sellExecutedQty;
            if(qtSell === 0){
                tmpThis.botManager.nbOrder--;
                tmpThis.mode = tmpThis.MODE().LISTEN_BUY;
                exec('spd-say "SELL ALERT"');
                Logger.log('warn', `!! SELL (CAS ANORMAL) : qtSell=${qtSell}`);
            }else{
                sellMarketPrice(qtSell);
            }
        });
    };
    let sellMarketPrice = function(qtSell){
        tmpThis.binance.sellMarketPrice(tmpThis.symbol, qtSell, (sellPrice)=>{
            tmpThis.botManager.nbOrder--;
            tmpThis.mode = tmpThis.MODE().LISTEN_BUY;
            let pctLost = util.pctEvol(tmpThis.buyPrice, sellPrice);
            Logger.log('info', `SELL SECURITY : ${tmpThis.symbol} qtSell=${qtSell} sellPrice=${sellPrice} pctLost=${pctLost}`.red.bold.dim);
        });
    };
    cancelOrder();
};

Strategy.prototype.eventUpdateTrade = function(price, quantity, qtExecuted, orderStatus){

    if(this.mode === this.MODE().TRY_BUY){
        if(orderStatus === "FILLED"){
            exec('spd-say "BUY"');
            Logger.log('info', `BUY : ${this.symbol} qtBuy/qtAsk=${qtExecuted}/${quantity}`.cyan.bold.dim);
            this.buyQt = qtExecuted;
            this.buyPrice = price;
            this.sell();
        }
    }
    if(this.mode === this.MODE().TRY_SELL){
        if(orderStatus === "FILLED"){
            this.botManager.nbOrder--;
            exec('spd-say "SELL"');
            Logger.log('info', `SELL : ${this.symbol} qtBuy/qtAsk=${qtExecuted}/${quantity}`.green.bold.dim);
            this.mode = this.MODE().LISTEN_BUY;
        }else{
            this.sellExecutedQty = qtExecuted;
        }
    }

};

Strategy.prototype.updateStrategy =  function(price, time){


    // Refresh values to calculate slope every minute
    if(time > this.slope.lastUpdate + 1000 * 60){

        this.slope.pricesForSmooth.push(price);
        if(this.slope.pricesForSmooth.length < this.slope.nbPricesForSmooth){
            return
        }
        let sum = 0;
        for(let i=0, n=this.slope.pricesForSmooth.length; i < n; i++)
        {
            sum += this.slope.pricesForSmooth[i];
        }
        let priceSmooth = sum / this.slope.pricesForSmooth.length;
        this.slope.pricesForSmooth = [];

        if(this.slope.historyPrices.length === this.slope.intervalRefresh){
            this.slope.historyPrices.pop(); // Retire dernier élément
        }
        this.slope.historyPrices.unshift(priceSmooth);
        if(this.mode ===  this.MODE().LISTEN_BUY){
            // Enough price to calculate slope
            if(this.slope.historyPrices.length === this.slope.intervalRefresh){
                let firstPrice = this.slope.historyPrices[this.slope.intervalRefresh-1];
                let lastPrice = this.slope.historyPrices[0];
                let slope = util.pctEvol(firstPrice, lastPrice);
                for(let dico of this.slope.pctBySlope){
                    if(slope > dico.inf && slope <= dico.sup){
                        Logger.log('debug', `Bot.prototype.updateStrategy:newPct : ${this.symbol} pctBuy=${dico.pctBuy} pctSell=${dico.pctSell} pctSellSecurity=${dico.pctSellSecurity} slope=${slope}`);
                        this.pctBuy = dico.pctBuy;
                        this.pctSell = dico.pctSell;
                        this.pctSellSecurity = dico.pctSellSecurity
                    }
                }
            }
        }
        this.slope.lastUpdate = time
    }
};

Strategy.prototype.MODE = function(){
    return {
        LISTEN_BUY : "LISTEN_BUY",
        TRY_BUY    : "TRY_BUY",
        WAIT_SELL  : "WAIT_SELL",
        TRY_SELL   : "TRY_SELL",
    }
};

try{
    let bot = new BotManager();
    bot.init();
}
catch(e){
    console.error(e)
}
