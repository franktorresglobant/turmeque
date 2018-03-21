'use strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();

class EventEmitter {
    constructor() {
    }

    static getEvenEmitter() {
        return eventEmitter;
    }
}

module.exports = EventEmitter;