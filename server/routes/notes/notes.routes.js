'use strict';

var NotesServices = require('../../services/notes/notes.service');
var ROUTES = require('../ROUTES').ROUTES();

class NoteRoutes {
    constructor(app){
        this.NotesServices = new NotesServices();
        this.initializeEndPoints(app);
    }

    initializeEndPoints(app){
        /**
         * @function POST
         * @param {Object} note Note to save.
         * {
         *      "note": "This is a note",
         *      "customerId": "5a9c5f7b824e7bb55079a454"
         *  }
         * @returns {Object} Note created.
         * {
         *      "note": "This is a note",
         *      "customerId": "5a9c5f7b824e7bb55079a454",
         *      "createdAt": "2018-03-04T21:53:20.340Z",
         *      "_id": "5a9c6ad00099fd683b7ce0c6",
         *      "__v": 0
         *  }
         */
        app.post(ROUTES.NOTES, (req, res) => {
            this.NotesServices.save(req.body.note, req.body.customerId)
                .then((data) => {
                    res.send(data);
                }, (err) => {
                    res.status(err.code).send(err);
                });
        });

        /**
         * @function GET
         * @description Get the notes by customer id
         * @param {String} id Id of the customer.
         * @returns {Array} Array of object with the notes properties.
         * [
            {
                "createdAt": "2018-03-04T21:50:59.789Z",
                "_id": "5a9c6a43db7e37678c93ee6d",
                "note": "This is a note",
                "customerId": "5a9c5f7b824e7bb55079a454",
                "__v": 0
            }
           ]
         */
        app.get(ROUTES.NOTES, (req, res) => {
            this.NotesServices.getByIdCustomer(req.query.id)
                .then((data) => {
                    res.send(data);
                }, (err) => {
                    res.status(err.code).send(err);
                });
        });

        /**
         * @function PUT
         * @description Update the note that matches with the query.
         * @param {String} id Id of the note.
         * @param {String} note Content of the note.
         * {
              "id": "5a9c6aa70099fd683b7ce0c5"
              "note": "This is a new note",
            }
         */
        app.put(ROUTES.NOTES, (req, res) => {
            this.NotesServices.editNote(req.body.id, req.body.note)
                .then((data) => {
                    res.send(data);
                }, (err) => {
                    res.status(err.code).send(err);
                })
        })
    }
}

module.exports = NoteRoutes;