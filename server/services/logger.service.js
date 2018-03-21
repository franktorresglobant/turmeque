'use strict';

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'admin_console.log' });

class LoggerService {

    constructor() {
    }
    static log(level, info) {
        winston.log(level, info);
    }   
}

module.exports = LoggerService;