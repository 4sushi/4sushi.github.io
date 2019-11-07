/**
 * Created by sushi on 08/05/17.
 */
import * as winston from "winston";

class Logger extends winston.Logger{


    constructor(){

        super({
            level: 'debug',
            transports: [
                new (winston.transports.Console)({
                    timestamp: function() {
                        return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                    },
                    formatter: function(options) {
                        // Return string will be passed to logger.
                        let date:string = '[' + options.timestamp() +']';
                        let level:string = '['+ options.level.toUpperCase() +']';
                        let msg: string = (options.message ? options.message : '') +
                            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                        return date + ' ' +  level   + ' ' + msg;
                    },
                    colorize: 'all',
                    prettyPrint : true
                }),
                new (winston.transports.File)({ filename: 'debug.log' })
            ]
        });
    }

    public logMessage(level:string, str:string):void{
        let message:string = '[MSG] ' + this.getClassMethodLineTrace() + ' ' + str;
        this.log(level, message);
    }

    public logParams(level:string, ...params:string[]):void{
        let str:string = '';
        for(let i in params){
            str += '['+i+']' + params[i] + ';' ;
        }
        let message:string = '[PARAMS] ' + this.getClassMethodLineTrace() + ' ' + str;
        this.log(level, message);
    }

    public logJSON(level:string, json:Object):void{
        let message:string = '[JSON] ' + this.getClassMethodLineTrace() + ' ' + JSON.stringify(json);
        this.log(level, message);
    }

    private getClassMethodLineTrace():string{

        let error:Error = new Error();
        let line:string = error.stack.split(' at ')[3];
        let classAndMethodName:string = line.split(' ')[0];
        let lineNumber:string = line.split(':')[1];
        return '[' + classAndMethodName + '.' +  lineNumber + ']';
    }

}

export const LOGGER = new Logger();