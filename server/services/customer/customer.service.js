'use strict';

var co = require('co');
var CustomerModel = require('../../model/customer/customer.model');
var ValidatorService = require('../validator/validator.service');
var objectId = require('mongodb').ObjectID;

class CustomerService {
    constructor(){
        this.customerModel = new CustomerModel();
    }

    /** 
     * @function getAll
     * @description Get all the customers in the collection.
     * @returns {Array}
    */
   getCustomer(id){
        var self = this;
        return co(coGetCustomer(self, id))
            .then(data => data)
            .catch(error => {
                throw error;
            });
    }

    /**
     * @function getDetail
     * @param {String} id Id of the customer
     * @returns {Object} Objecte that represent the customer.
     */
    getDetail(id){
        var self = this;
        return co(coGetDetail(self))
            .then(data => data)
            .catch(error => {
                throw error;
            });
    }

    /**
     * @function changeStatus
     * @param {String} id Id of the customer.
     * @param {String} status New Status, there are three options: prospective, current, non-active.
     * 
     */
    changeStatus(id, status){
        var self = this;
        return co(coChangeStatus(self, id, status))
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
 * @function coGetAll
 * @yields {Array} Documents in the Customer collection.
 * @returns {Array} Documents in the Customer collection.
*/
function* coGetCustomer(self, id){
    if(id){
        yield ValidatorService.mongoId(id);
        var customer = yield self.customerModel.getDetail(objectId(id));
    }else{
        var customer = yield self.customerModel.getAll();
    }

    return customer;
}

/**
 * @generator
 * @function coChangeStatus
 * @param {Object} self Represent the class itself.
 * @param {*} id The id of the customer.
 * @param {*} status The new status.
 */
function* coChangeStatus(self, id, status){
    yield ValidatorService.mongoId(id);
    yield ValidatorService.status(status);

    var status = yield self.customerModel.changeStatus(id, status);

    return status;
}
module.exports = CustomerService;