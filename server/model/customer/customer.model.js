'use strict';

var Connection = require('../connection');
var CustomerEntity = require('./customer.entity');

class CustomerModel extends Connection{
    constructor(){
        super();
        this.customerEntity = new CustomerEntity(this.mongoose);
    }

    /**
     * @function getAll
     * @returns {Array} All the documents find in the customer collection.
    */
    getAll(){
        return new Promise((success, reject) => {
            this.customerEntity.Model.find({}, function(err, customer){
                if(err) reject(err);
                success(customer)
            });
        })
    }

    /**
     * @function getDetail
     * @param {String} id Id of the customer.
     * @returns {Object} The document that match the query.
     */
    getDetail(id){
        return new Promise((success, reject) => {
            this.customerEntity.Model.findOne({_id: id}, function(err, customer){
                if(err) reject(err);
                success(customer);
            })
        })
    }

    /**
     * @function changeStatus
     * @param {String} id Id of the customer.
     * @param {Boolean} status 
     */
    changeStatus(id, status){
        return new Promise((success, reject) => {
            this.customerEntity.Model.update(
                {_id: id},
                {
                    $set: {
                        status: status
                    }
                },
                function(err, status){
                    if(err) reject(ErrorService.buildErrorResponse(err, 500));
                    success(status);
                }
            )
        })
    }

    /**
     * @function bulkCustomers
     * @description Insert a bunch of documents in the customer collection.
     * @param {Array} customers 
     */
    bulkCustomers(customers){
        var self = this;
        return new Promise((success, reject) => {
            for(let i=0; i<customers.length; i++){
                var customerEntity = self.customerEntity.Model;
                new customerEntity(customers[i])
                    .save(function(err, customer){
                        if(err) reject(err);
                        success(customer);
                    })
            }
        })
    }
}

module.exports = CustomerModel;