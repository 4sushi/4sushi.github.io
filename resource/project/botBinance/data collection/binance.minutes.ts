import 'request';
import request = require("request");
import * as fs from "fs";

// Sniff one symbol for each minute one binance
// Start date now

class Sniffer{

  symbols:string[] = ['BTCUSDT'];

    constructor(){
    }

    async run():Promise<void>{

        for(let symbol of this.symbols){
          let endTime:string = '';
          let finish = false;
          let filestream:any = fs.createWriteStream(symbol+'.csv');
          Util.writeLine(filestream, "DATE", "OPEN", "HIGH", "LOW", "CLOSE", "VOLUME");


          while(!finish){
              let oldPriceTime:number = await this.process(filestream,symbol, endTime);
              if(oldPriceTime == null || oldPriceTime < new Date().getTime() - 1000 * 60 *60 *24 * 365){
                finish = true;
                Util.writeFile(filestream);
              }
              else{
                oldPriceTime -= 1000*60; // -1min
                endTime = '&endTime=' + oldPriceTime.toString();
                console.log(symbol, Util.formatTime(oldPriceTime));
                await Util.wait(200);
              }
          }

        }
    }

    async process(filestream:any, symbol:string, endTime:string):Promise<number>{
        let lines:any = await Util.requestAsync("https://www.binance.com/api/v1/klines?symbol="+symbol+"&interval=1m" + endTime);
        lines = JSON.parse (lines);
        if(lines.length == 0){
          return null;
        }
        for(var i = lines.length - 1; i >= 0; i--){
            let line:any = lines[i];
            Util.writeLine(filestream, Util.formatTime(line[0]), line[1], line[2], line[3], line[4], line[5]);
        }
        let oldPriceTime = lines[0][0];
        return oldPriceTime;
    }


}


class Util{

    static formatTime(time:number){
        let date:Date = new Date(time);
        return date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].slice(0,8);
    }

    static writeLine(filestream:any, ...values:any[]){
        filestream.write(values.join(",")+'\n');
    }

    static writeFile(filestream:any){
        filestream.end();
    }

    static requestAsync(url:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            request(url, function (error, response, data) {
                if(error){
                    return reject(error);
                }
                if(response && response.statusCode != 200){
                    return reject(response.statusCode);
                }
                return resolve(data);
            });
        });
    }

    static wait(time):Promise<void>{
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, time)
        });
    }

}

const sniffer = new Sniffer();
sniffer.run().catch((e)=>{
    console.error(e);
});
