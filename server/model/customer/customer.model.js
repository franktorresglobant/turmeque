'use strict';

var Connection = require('../connection');
var CustomerEntity = require('./customer.entity');

class CustomerModel extends Connection{
    constructor(){
        super();
        this.customerEntity = new CustomerEntity(this.mongoose);
    }

    getAll(){
        return new Promise((success, reject) => {
            this.customerEntity.Model.find({}, function(err, customer){
                if(err) reject(err);
                success(customer)
            });
        })
    }

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
}

module.exports = CustomerModel;