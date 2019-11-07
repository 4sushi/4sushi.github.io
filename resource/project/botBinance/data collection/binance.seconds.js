// Libs
const fs = require('fs');
const binance = require('node-binance-api');
const Util = require('./util');

/**************************/
/*        Sniffer         */
/**************************/

function Sniffer() {
  this.basePath = "../data/binance.seconds/";
  this.currentHour = new Date().getHours();
  this.symbols = ['ETHBTC', 'DGDBTC', 'VENBTC', 'ETCBTC', 'LTCBTC', 'TRXBTC', 'ICXBTC', 'LSKBTC', 'XRPBTC', 'NANOBTC'];
  this.files = {};
  for(var i = 0; i < this.symbols.length; i++){
    var path = this.basePath + this.symbols[i];
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
    // On enleve les secondes et les minutes
    var fileName = new Date().getTime() - (new Date().getTime() % (1000*60*60));
    // On retire une heure pour être à l'heure du site binance
    fileName -= 1000 * 60 * 60;
    this.files[this.symbols[i]] = fs.createWriteStream(path + '/' + fileName + '.txt');
    Util.writeLine(this.files[this.symbols[i]], "DATE", "PRICE", "VOLUME");
  }
};

Sniffer.prototype.changeHour = function(){
  for(var i = 0; i < this.symbols.length; i++){
    var path = this.basePath + this.symbols[i];
    // On enleve les secondes et les minutes
    var fileName = new Date().getTime() - (new Date().getTime() % (1000*60*60));
    // On retire une heure pour être à l'heure du site binance
    fileName -= 1000 * 60 * 60;
    Util.writeFile(this.files[this.symbols[i]]);
    this.files[this.symbols[i]] = fs.createWriteStream(path + '/' + fileName + '.txt');
    Util.writeLine(this.files[this.symbols[i]], "DATE", "PRICE", "VOLUME");
  }
}

Sniffer.prototype.init = function(){

  var tmpThis = this;

  // Event update trade
  binance.websockets.trades(tmpThis.symbols, (trades) => {
    let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
    if(new Date().getHours() != this.currentHour){
      this.currentHour = new Date().getHours();
      this.changeHour();
    }
    var date = new Date(eventTime);
    var file = tmpThis.files[symbol];
    // console.log(Util.formatDateSec(date), symbol, price, quantity);
    Util.writeLine(file, Util.formatDateSec(date), price, quantity);
  });

  // Event exit program
  process.on('SIGINT', function() {
    for(var i = 0; i < tmpThis.symbols.length; i++){
      Util.writeFile(tmpThis.files[tmpThis.symbols[i]]);
    }
    process.exit();
  });


};

var sniffer = new Sniffer();
sniffer.init();
