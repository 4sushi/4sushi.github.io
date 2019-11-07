/*
* Surcouche de l'API node-binance-API
*/

const { exec } = require('child_process');
const util = require('./util');
const binanceAPI = require('node-binance-api');
const Logger = require('./logger');

function Binance(symbols){
    // Symboles à écouter
    this.symbols = symbols; // Array<string>
    // Prix total de l'ordre d'achat, en bitcoin
    this.totalPrice = 0.011; // this.totalPrice = 0.0011;
    // Information pour chaque symbole
    // this.exchangeInfos[symbol] = {}
    // this.exchangeInfos[symbol].pricePrecision - Précision pour calculer l'arrondie du prix
    // this.exchangeInfos[symbol].qtPrecision - Précision pour calculer l'arrondie de la quantité
    this.exchangeInfos = {}; // Map<string, Map<string, number>> clé : symbol, value : market information
    for(let i = 0; i < this.symbols.length; i++){
        this.exchangeInfos[this.symbols[i]] = {pricePrecision : null, qtPrecision : null};
    }
}

Binance.prototype.init = function(bot, callback){
    this.initConnection(()=>{
        this.initExchangeInfo((err)=>{
            if(err){
                Logger.log('error', `Binance.prototype.init : Erreur pendant l'initialisation des informations d'échanges`)
                Logger.log('error', err);
                process.exit();
            }
            this.initEvent(bot);
            return callback();
        })
    })
};

Binance.prototype.initConnection = function(callback){
    binanceAPI.options({
        APIKEY: 'XXX',
        APISECRET: 'XXX',
        useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
        test: false // If you want to use sandbox mode where orders are simulated
    }, callback);
};

Binance.prototype.initExchangeInfo = function(callback){
    let tmpThis = this;
    binanceAPI.exchangeInfo((err,data) =>{
        if(err){
            return callback(err);
        }
        for ( let obj of data.symbols ) {
            if(tmpThis.exchangeInfos[obj.symbol] ===  undefined){
                continue;
            }
            for ( let filter of obj.filters ) {
                if ( filter.filterType === "MIN_NOTIONAL" ) {
                    // tmpThis.exchangeInfos[obj.symbol].minNotional = filter.minNotional;
                }
                else if ( filter.filterType === "PRICE_FILTER" ) {
                    let pricePrecision = filter.tickSize.search(/[1-9]/g);
                    if(pricePrecision > 1){
                        pricePrecision--;
                    }
                    tmpThis.exchangeInfos[obj.symbol].pricePrecision = pricePrecision;
                }else if ( filter.filterType === "LOT_SIZE" ) {
                    tmpThis.exchangeInfos[obj.symbol].qtMin = filter.minQty;
                    let qtPrecision = filter.minQty.search(/[1-9]/g);
                    if(qtPrecision > 1){
                        qtPrecision--;
                    }
                    tmpThis.exchangeInfos[obj.symbol].qtPrecision = qtPrecision ;
                }
            }
        }
        return callback();
    });
};

Binance.prototype.initEvent = function(bot){
    // Evenement nouveau trade
    let tmpThis = this;
    binanceAPI.websockets.trades(tmpThis.symbols, (trades) => {
        let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
        bot.eventNewTransaction(symbol, parseFloat(price), eventTime);
    });

    binanceAPI.websockets.userData(()=>{}, (data)=>{
        let { s:symbol, p:price, q:quantity, i:orderId, X:orderStatus, z:qtExecuted, E:eventTime} = data;
        bot.eventUpdateTrade(symbol, parseFloat(price), quantity, qtExecuted, orderStatus)
    })
};

Binance.prototype.buyLimit = function(symbol, price, callback){
    Logger.log('debug', `Binance.prototype.buyLimit:input : symbol=${symbol} price=${price}`);
    let quantity = util.ceil(this.totalPrice / price, this.exchangeInfos[symbol].qtPrecision);
    Logger.log('debug', `Binance.prototype.buyLimit:1 : quantity=${quantity}`);
    binanceAPI.buy(symbol, quantity, price, {type:'LIMIT'}, (err, response) => {
        if(err){
            let msgError = err.toJSON().body;
            Logger.log('error', `Binance.prototype.buyLimit : ${msgError}`);
            process.exit()
        }
        if(response === undefined || response.orderId === undefined){
            let msgError = "Order id nul";
            Logger.log('error', `Binance.prototype.buyLimit : ${msgError}`);
            process.exit()
        }
        let orderId = response.orderId;
        Logger.log('debug', `Binance.prototype.buyLimit:output : orderId=${orderId} quantity=${quantity}`);
        return callback(orderId, quantity);
    });
};

Binance.prototype.sellLimit = function(symbol, quantity, price, callback){
    Logger.log('debug', `Binance.prototype.sellLimit:input : symbol=${symbol} price=${price} quantity=${quantity}`);
    price = util.round(price, this.exchangeInfos[symbol].pricePrecision);
    quantity = util.floor(quantity, this.exchangeInfos[symbol].qtPrecision);
    Logger.log('debug', `Binance.prototype.sellLimit:1 : price=${price} quantity=${quantity}`);
    binanceAPI.sell(symbol, quantity, price, {type:'LIMIT'}, (err, response) => {
        if(err){
            let msgError = err.toJSON().body;
            Logger.log('error', `Binance.prototype.sellLimit : ${msgError}`);
            process.exit()
        }
        if(response === undefined || response.orderId === undefined){
            let msgError = "Order id nul";
            Logger.log('error', `Binance.prototype.sellLimit : ${msgError}`);
            process.exit()
        }
        Logger.log('debug', `Binance.prototype.sellLimit:output : orderId=${response.orderId}`);
        return callback(response.orderId);
    });
};

Binance.prototype.sellMarketPrice = function(symbol, qtSell, callback){
    Logger.log('debug', `Binance.prototype.sellMarketPrice:input : symbol=${symbol} qtSell=${qtSell}`);
    binanceAPI.marketSell(symbol, qtSell, (err, response) => {
        if(err){
            let msgError = err.toJSON().body;
            Logger.log('error', `Binance.prototype.sellMarketPrice:n1 : ${msgError}`);
            process.exit()
        }
        if(response === undefined || response.orderId === undefined){
            let msgError = "Order id nul";
            Logger.log('error', `Binance.prototype.sellMarketPrice:n2 : ${msgError}`);
            process.exit()
        }
        /* Exemple retour
        { id: 40725076, orderId: 94279602, price: '0.07504200', qty: '0.00100000', commission: '0.00004539',
          commissionAsset: 'BNB', time: 1520330375934, isBuyer: false, isMaker: false, isBestMatch: true }
        */
        binanceAPI.trades(symbol, (err, trades, symbol) => {
            if(err){
                let msgError = err.toJSON().body;
                Logger.log('error', `Binance.prototype.sellMarketPrice:n3 : ${msgError}`);
                process.exit()
            }
            let trade = trades.find((trade)=> {return trade.orderId === response.orderId });
            if(trade === undefined){
                let msgError = "Order id nul";
                Logger.log('error', `Binance.prototype.sellMarketPrice:n4 : ${msgError}`);
                process.exit()
            }
            Logger.log('debug', `Binance.prototype.sellMarketPrice:output : price=${trade.price}`);
            callback(trade.price);
        });
    });
};

Binance.prototype.cancelOrder = function(symbol, orderid, callback){
    Logger.log('debug', `Binance.prototype.cancelOrder:input : symbol=${symbol} orderid=${orderid}`);
    let tmpThis = this;
    binanceAPI.cancel(symbol, orderid, (err, response, symbol) => {
        if(err){
            let msgError = err.toJSON().body;
            // TODO test, a modifier peut etre
            let msg = JSON.parse(msgError).msg;
            // Si l'ordre est passé, on ignore l'erreur
            if(msg === "UNKNOWN_ORDER"){
                Logger.log('warn', `Binance.prototype.cancelOrder : msg=${msg}`)
            }
            else{
                Logger.log('error', `Binance.prototype.cancelOrder : msgError=${msgError} msg=${msg}`);
                process.exit()
            }
        }
        Logger.log('debug', `Binance.prototype.cancelOrder:output`)
        return callback();
    });
};

Binance.prototype.getBalance = function(symbol, callback){
    Logger.log('debug', `Binance.prototype.getBalance:input : symbol=${symbol}`);
    let tmpThis = this;
    binanceAPI.balance((err, balances) => {
        if(err){
            let msgError = err.toJSON().body;
            Logger.log('error', `Binance.prototype.getBalance: ${msgError}`);
            process.exit()
        }
        let cryptoName = symbol.replace('BTC', '');
        let qtAvailable = balances[cryptoName].available;
        if(qtAvailable < tmpThis.exchangeInfos[symbol].qtMin){
            qtAvailable = 0
        }
        Logger.log('debug', `Binance.prototype.getBalance:output : qtAvailable=${qtAvailable}`);
        return callback(qtAvailable);
    });
};



module.exports = Binance;
