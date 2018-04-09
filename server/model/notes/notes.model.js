'use strict';

var Connection = require('../connection');
var NotesEntity = require('./notes.entity');
var ErrorService = require('../../services/errors/error.service');

class NotesModel extends Connection{
    constructor(){
        super();
        this.NotesEntity = new NotesEntity(this.mongoose);
    }

    /**
     * @function save
     * @param {String} note The note over the customer.
     * @return {Object} Note created.
     */
    save(note, customerId){
        console.log(note, customerId);
        var self = this;
        return new Promise((success, reject) => {
            var notesEntity = self.NotesEntity.Model;
            new notesEntity(
                {
                    note: note,
                    customerId: customerId
                }).save(function(err, note){
                    if(err){
                        reject(err);
                    }
                    success(note);
                }
            );
        });
    }

    /**
     * @function getByIdCustomer
     * @param {Object} id MongoId
     * @returns {Array} Documents that match with the query based on the id.
     */
    getByIdCustomer(id){
        var self = this;
        return new Promise((success, reject) => {
            self.NotesEntity.Model.find({customerId: id}, function(err, notes){
                if(err) reject(ErrorService.buildErrorResponse(err, 500));
                success(notes);
            })
        })
    }

    /**
     * @function editNote
     * @param {String} id Id of the note
     * @param {String} note The note to add to the customer
     */
    editNote(id, note){
        var self = this
        return new Promise((success, reject) => {
            self.NotesEntity.Model.update(
                {_id: id},
                {
                    $set: {
                        note: note
                    }
                },
                function(err, note){
                    if(err) reject(ErrorService.buildErrorResponse(err, 500));
                    success(note);
                }
            )
        })
    }

}

module.exports = NotesModel;