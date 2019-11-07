const winston = require('winston');
const util = require('./util');


const myFormat = winston.format.printf(info => {
  return `${util.formatDateSec(new Date())} [${info.level}] ${info.message}`;
});

const format2 = winston.format.printf(info => {
    return `🤖 ${util.formatTime(new Date())} ${info.message}`;
});

const Logger = winston.createLogger({
  level: 'debug',
  format: myFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/trace.log'})
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  Logger.add(new winston.transports.Console({level: 'info', format : format2
  }));
}

module.exports = Logger;
