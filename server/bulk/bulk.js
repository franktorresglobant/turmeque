'use strict';

var CustomerModel = require('../model/customer/customer.model');
var NotesModel = require('../model/notes/notes.model');
var customers = require('./customers').customers;

class BulkDatabase {
    constructor(){
        this.CustomerModel = new CustomerModel;
        this.NotesModel = new NotesModel;
        this.customersBulk();
    }

    customersBulk(){
        this.CustomerModel.bulkCustomers(customers).then((data) => {
            console.log("Customers bulk went well :)");
        }, (err) => {
            console.log("Something went wrong :(");
        })
    }
}
module.exports = BulkDatabase;
new BulkDatabase();