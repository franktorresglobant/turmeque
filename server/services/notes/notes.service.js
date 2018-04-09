'use strict';

var co = require('co');
var objectId = require('mongodb').ObjectID;
var NotesModel = require('../../model/notes/notes.model.js');
var ValidatorService = require('../validator/validator.service');

class NotesService {
    constructor(){
        this.NotesModel = new NotesModel();
    }

    /**
     * @function save
     * @param {String} note The note to add for the customer.
     * @param {String} customerId The id of the customer.
     * @returns {Object} The document created.
     */
    save(note, customerId){
        var self = this;
        return co(coSave(self, note, customerId))
            .then(data => data)
            .catch(error => {
                throw error;
            })
    }

    /**
     * @function getByIdCustomer
     * @param {String} id The id of the customer.
     * @returns {Array} Documents that match the query.
     */
    getByIdCustomer(id){
        var self = this;
        return co(coGetByIdCustomer(self, id))
            .then(data => data)
            .catch(error => {
                throw error;
            })
    }

    /**
     * @function editNote
     * @param {String} id The id of the note to edit.
     * @param {String} note The note to edit.
     * @returns {Object} The note updated.
     */
    editNote(id, note){
        var self = this;
        return co(coEditNote(self, id, note))
            .then(data => data)
            .catch(error => {
                throw error;
            });
    }
}

/*
 *Private functions 
 */

 /**
  * @generator
  * @function coSave
  * @param {Object} self Represent the class itself.
  * @param {String} note The note over the customer.
  * @returns {Object} The note just created.
  */
function* coSave(self, note, customerId){
    yield ValidatorService.note(note);
    yield ValidatorService.mongoId(customerId);
    var note = yield self.NotesModel.save(note, customerId);

    return note;
}

/**
 * @generator
 * @function coGetByIdCustomer
 * @param {Object} self Represent the class itself.
 * @param {String} id Id of the customer.
 * @returns {Array} Documents that match the query.
 */
function* coGetByIdCustomer(self, id){
    yield ValidatorService.mongoId(id);

    var notes = yield self.NotesModel.getByIdCustomer(objectId(id));

    return notes;
}

/**
 * @generator
 * @function coEditNote
 * @param {Object} self Represent the class itself.
 * @param {String} id The id of the note.
 * @param {String} note The new note.
 * @returns {Object} the note updated.
 */
function* coEditNote(self, id, note){
    yield ValidatorService.note(note);
    yield ValidatorService.mongoId(id);
    
    var note = yield self.NotesModel.editNote(objectId(id), note);

    return note;
}
module.exports = NotesService;