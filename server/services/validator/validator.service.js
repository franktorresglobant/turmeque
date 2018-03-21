'use strict';

var validator = require('validator');
var ErrorService = require('../errors/error.service');
var MESSAGES = require('../MESSAGES').MESSAGES();

module.exports = {
    mongoId: (id) => {
        var errors = [];
        return new Promise((success, reject) => {
            if(!id || validator.isEmpty(id)){
                errors.push(ErrorService.buildErrorMessage('Id', MESSAGES.ERRORS.ID_NULL));
            }else if(!validator.isMongoId(id)){
                errors.push(ErrorService.buildErrorMessage('Id', MESSAGES.ERRORS.ID_NO_VALID));
            }
            
            if(errors.length > 0){
                reject(ErrorService.buildErrorResponse(errors, 400));
            }else{
                success();
            }
        })
    },
    note: (note) => {
        var errors = [];
        return new Promise((success, reject) => {
            if(!note || validator.isEmpty(note)){
                errors.push(ErrorService.buildErrorMessage('Note', MESSAGES.ERRORS.NOTE_NULL));
            }else if(!validator.isLength(note, {min:0, max: 500})){
                errors.push(ErrorService.buildErrorMessage('Note', MESSAGES.ERRORS.NOTE_LENGTH));
            }

            if(errors.length > 0){
                reject(ErrorService.buildErrorResponse(errors, 400));
            }else{
                success();
            }
        })
    },
    status: (status) => {
        var statuses = ["Prospective", "Current", "Non-active"];
        var errors = [];
        return new Promise((success, reject) => {
            if(!status || validator.isEmpty(status)){
                errors.push(ErrorService.buildErrorMessage('Status', MESSAGES.ERRORS.STATUS_NULL));
            }
            else if(statuses.indexOf(status) == -1){
                errors.push(ErrorService.buildErrorMessage('Status', MESSAGES.ERRORS.STATUS_NO_VALID));
            }

            if(errors.length > 0){
                reject(ErrorService.buildErrorResponse(errors, 400));
            }else{
                success();
            }
        })
    }
}