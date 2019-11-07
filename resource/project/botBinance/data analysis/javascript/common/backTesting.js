const fs = require("fs")
const path = require("path")
const readline = require('readline')
const shortid = require('shortid')
const Historic = require('./historic')
const Util = require('./util')


class BackTesting{

  constructor(){
    this.lines = []
    this.order = null;
    this.transactionTime = null
    this.mode = 'LISTEN_BUY';
    this.buyPrice = null;

    this.broker = {}
    this.broker.cash = 0.1;
    this.broker.sellFees = 0.05;
    this.broker.buyFees = 0.05;
    this.broker.portfolio = {'ETHBTC' : 0}
    this.broker.lastPrices = {'ETHBTC' : 0}
  }

  getFilesDir(dir){
    var walkSync = function(dirPath, filelist = []){
      fs.readdirSync(dirPath).forEach(function(file){
        filelist = fs.statSync(path.join(dirPath, file)).isDirectory()
          ? walkSync(path.join(dirPath, file), filelist)
          : filelist.concat(path.join(dirPath, file));
      });
      return filelist.sort();
    }
    return walkSync(dir);
  }

  getFirstLineDir(dir, callback){
    var first = true;
    var find = false;
    var file = this.getFilesDir(dir)[0];
    this.getFirstLineFile(file, true, function(line){
      return callback(line)
    })
  }

  getFirstLineFile(path, ignoreFirst, callback){
    var first = true;
    var find = false;
    var readStream = fs.createReadStream(path, { start : 0, end : 200 });
    var rl = readline.createInterface({
      input: readStream,
      });
    rl.on('line', (line) => {
      if(ignoreFirst && first){
        first = false
        return
      }
      if(!find){
        find = true;
        return callback(line.split(','))
      }
    });
  }

  loadFiles(dir, callback){
    var thisTmp = this;
    var files = thisTmp.getFilesDir(dir)
    var loopLoadFile = function(i, files){
      if(i == files.length){
        return callback();
      }
      thisTmp.loadFile(files[i], function(){
        i++;
        loopLoadFile(i, files);
      });
    }
    loopLoadFile(0, files);
  }

  loadFile(file, callback) {
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
      thisTmp.lines.push(line.split(','))
    });
    rl.on('close', () => {
      callback();
    });
  }

  cancelOrder(order, date){ // TODO delete date param

    order.setStatus(Order.STATUS().ANNULATE, date)
    if(order.type == Order.TYPE().BUY){
        this.broker.cash += (order.quantity - order.qtExecuted ) * order.price * (1 - this.broker.buyFees / 100)
    }else if(order.type == Order.TYPE().SELL){
        this.broker.portfolio[order.name] += order.quantity - order.qtExecuted
    }
    order = null
  }

  buyLimit(name, date, price, quantity = null){
    if(!quantity){
        quantity = this.broker.cash / price / (1 + this.broker.buyFees / 100)
        quantity = Util.floor(quantity, 8)
    }
    var amount = quantity * price * (1 + this.broker.buyFees / 100)
    if(amount > this.broker.cash || this.broker.cash == 0){
        throw new Error(`[ERROR][Strategy.buyLimit] You do not have enough money to buy, amount=${amount} cash=${this.broker.cash}`)
    }
    this.broker.cash -= amount
    var order = new OrderLmit(this, name, Order.TYPE().BUY, date, price, quantity)
    return order
  }

  sellLimit(name, date, price, quantity = null){

    if(!quantity){
        quantity = this.broker.portfolio[name]
    }
    if(quantity > this.broker.portfolio[name] || quantity == 0){
        throw new Error(`[ERROR][Strategy.sellLimit] You do not have enough quantity of ${name} in your portfolio to sell, quantity=${quantity} portfolio=${this.broker.portfolio[name]}`)
    }

    this.broker.portfolio[name] -= quantity
    var order = new OrderLmit(this, name, Order.TYPE().SELL, date, price, quantity)
    return order
  }

  sellMarket(name, date, quantity = null){
    if(!quantity){
      var quantity = this.broker.portfolio[name]
    }
    if(quantity > this.broker.portfolio[name] || quantity == 0){
        throw new Error(`[ERROR][Strategy.sellLimit] You do not have enough quantity of ${name} in your portfolio to sell, quantity=${quantity} portfolio=${this.broker.portfolio[name]}`)
    }
    this.broker.portfolio[name] -= quantity
    var order = new OrderMarket(this, name, Order.TYPE().SELL, date, quantity)
    return order
  }

  brokerValue(){
    var sum = this.broker.cash
    for(var name in this.broker.portfolio){
      var lastPrice = this.broker.lastPrices[name]
      sum += lastPrice * this.broker.portfolio[name]
    }
    if(this.order){
      if(this.order.status != Order.STATUS().FILLED){
          sum += (this.order.quantity - this.order.qtExecuted) * this.broker.lastPrices[name]
      }
    }
    return Util.floor(sum,8)
  }
}

class Order{


    constructor(backtesting, name, type, method, date, price, quantity){
        this.broker = backtesting.broker;
        this.id = shortid.generate()
        this.name = name
        this.type = type
        this.method = method
        this.price = price
        this.quantity = quantity
        this.qtExecuted = 0
        this.startDate = date
        this.endDate = null
        this.setStatus(Order.STATUS().CREATED, date)
    }

    static STATUS(){
        return {
            CREATED : "CREATED",
            PARTIALLY_FILLED : "PARTIALLY",
            FILLED : "FILLED",
            ANNULATE : "ANNULATE"
        }
    }

    static TYPE(){
        return {
            BUY : "BUY",
            SELL : "SELL"
        }
    }

    static METHOD(){
        return {
            LIMIT : "LIMIT",
            MARKET : "MARKET"
        }
    }

    setStatus(newStatus, date){
        this.status = newStatus
        // this.evtOrderChangeSatus(newStatus, date)
    }

    evtOrderChangeSatus(newStatus, date){
      var priceFloor = Util.floor(this.price, 4)
      var quantityFloor = Util.floor(this.quantity, 4)
      var quantityEFloor = Util.floor(this.qtExecuted, 4)
      var qt = `${quantityEFloor}/${quantityFloor}`.padEnd(15)
      var pr = `${priceFloor}`.padEnd(7)
      var cash = Util.floor(this.broker.cash, 6)
      console.log(`${date.toISOString()} ${this.type.padEnd(4)} ${this.method.padEnd(6)} ${newStatus.padEnd(9)} ${qt} ${pr} ${cash}`)
    }

}

class OrderLmit extends Order{

    constructor(backtesting, name, type, date, price, quantity){
        super(backtesting, name, type, Order.METHOD().LIMIT, date, price, quantity)
    }

    update(date, price, quantity){
        if(this.status == Order.STATUS().FILLED){
            return
        }
        var qtExecutedInit = this.qtExecuted
        if(this.type == Order.TYPE().BUY){
            if(price < this.price){
                var qtRest = this.quantity- this.qtExecuted
                if(quantity >= qtRest){
                    this.qtExecuted = this.quantity
                    this.broker.portfolio[this.name] += qtRest
                }
                else{
                    this.qtExecuted += quantity
                    this.broker.portfolio[this.name] += quantity
                }
            }
            else{
                return
            }
        }
        else if(this.type == Order.TYPE().SELL){
            if(price > this.price){
                var qtRest = this.quantity- this.qtExecuted
                if(quantity >= qtRest){
                    this.qtExecuted = this.quantity
                    this.broker.cash += price * qtRest * (1 - this.broker.sellFees / 100)
                }
                else{
                    this.qtExecuted += quantity
                    this.broker.cash += price * quantity * (1 - this.broker.sellFees / 100)
                }
            }
            else{
                return
            }
        }

        if(this.quantity== this.qtExecuted){
            this.setStatus(Order.STATUS().FILLED, date)
            this.endDate = date
        }
        else if(qtExecutedInit != this.qtExecuted){
            this.setStatus(Order.STATUS().PARTIALLY_FILLED, date)
        }
    }
}

class OrderMarket extends Order{
    constructor(backtesting, name, type, date, qt){
        super(backtesting, name, type, Order.METHOD().MARKET, date, 0, qt)
    }

    update(date, price, quantity){
      if(this.status == Order.STATUS().FILLED){
          return
      }
      var qtExecutedInit = this.qtExecuted;
        if(this.type == Order.TYPE().BUY){
            var qtRest = this.quantity- this.qtExecuted
            if(quantity >= qtRest){
                this.qtExecuted = this.quantity
                this.broker.portfolio[this.name] += qtRest
                this.price += Util.floor(price * (qtRest / this.quantity),8)
            }
            else{
                this.qtExecuted += quantity
                this.broker.portfolio[this.name] += quantity
                this.price += Util.floor(price * (quantity / this.quantity),8)
            }
        }
        else if(this.type == Order.TYPE().SELL){
            var qtRest = this.quantity- this.qtExecuted
            if(quantity >= qtRest){
                this.qtExecuted = this.quantity
                this.broker.cash += price * qtRest * (1 - this.broker.sellFees / 100)
                this.price += Util.floor(price * (qtRest / this.quantity),8)
            }
            else{
                this.qtExecuted += quantity
                this.broker.cash += price * quantity * (1 - this.broker.sellFees / 100)
                this.price += Util.floor(price * (quantity / this.quantity), 8)
            }

        }
        if(this.quantity== this.qtExecuted){
            this.setStatus(Order.STATUS().FILLED, date)
            this.endDate = date
        }
        else if(qtExecutedInit != this.qtExecuted){
            this.setStatus(Order.STATUS().PARTIALLY_FILLED, date)
        }
    }
}

module.exports = module.exports = {
  BackTesting : BackTesting,
  Order : Order
}
