'use strict';

var CustomerService = require('../../services/customer/customer.service');
var ROUTES = require('../ROUTES').ROUTES();

class CustomerRoute {
    constructor(app){
        this.CustomerService = new CustomerService();
        this.initializeEndpoints(app);
    }

    /**
     * @function initializeEndpoints
     * @description This function initialize and allows to get access to the correspondent end point
     *              to this module.
     * @param {Object} app Express representation
     */
    initializeEndpoints(app){
        
        /**
         * @async
         * @function GET Get the documents from the customer collection
         * @returns {Array} An array of objects if there are documents in the collections or an empty array.
         * [
         *      {
         *          "_id": "5a9c5f7b824e7bb55079a454",
         *          "name": "Propellerhead",
         *          "descr": "Description of the customer",
         *          "website": "www.propellerhead.com",
         *          "address": "Cra 23 # 68 - 50",
         *          "phone": "1234567890",
         *          "status": "prospective",
         *          "createdAt": "prospective",
         *      }
         *  ]
         */
        app.get(ROUTES.CUSTOMER, (req, res) => {
            this.CustomerService.getCustomer(req.query.id)
                .then((data) => {
                    return res.send(data);
                }, (err) => {
                    return res.status(err.code).send(err);
                });
        });

        
        app.put(ROUTES.CUSTOMER, (req, res) => {
            this.CustomerService.changeStatus(req.body.id, req.body.status)
                .then((data) => {
                    return res.send(data);
                }, (err) => {
                    return res.status(err.code).send(err);
                });
        })
    }
}

module.exports = CustomerRoute;