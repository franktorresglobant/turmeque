'use strict';

var LoggerService = require('../services/logger.service');
var EventEmitter = require('../services/eventEmitter/eventEmitter.service');
var mongoose = require('mongoose');
// To use native promises in mongoose
mongoose.Promise = global.Promise;
var mongooseInstance = null;
const config = require('../config/config');


class Connection {

    constructor() {
        //Return always the same instance of mongoose
        if (!mongooseInstance) {
            this.mongoose = mongoose;
            mongooseInstance = this.mongoose;
            var opts = { auto_reconnect: true };
            if(config.db.indexOf("fake_db_url") === -1){
                this.mongoose.connect('mongodb://' + config.db, opts);
                var db = this.mongoose.connection;
                this.createConn(db);
            }
        } else {
            this.mongoose = mongooseInstance;
        }
    }

    /**
     * @function createConn
     * @description Manage the different status for the connection.
     * @param {Object} db Mongoose object database
     */
    createConn(db) {
        return new Promise((success, reject) => {
            db.on('error', (ref) => {
                LoggerService.log('error', ref);
                reject();
            });
            db.once('open', (ref) => {
                EventEmitter.getEvenEmitter().emit('MongoConnected');
                LoggerService.log('info', 'Mongo Connection Success to ' + config.db);
                LoggerService.log('info', 'Current Database ' + db.name);

                success();
            });
            db.on('disconnected', function (ref) {
                LoggerService.log('info', 'Mongo disconnected ' + db.name);
            });
            db.on('close', function (ref) {
                LoggerService.log('info', 'Mongo closed ' + db.name);
            });
            db.on('reconnect', function (ref) {
                LoggerService.log('error', ref);
            });
        });
    }
};

module.exports = Connection;
