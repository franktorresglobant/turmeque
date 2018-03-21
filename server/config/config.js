'use strict';

process.env.DB_IP = 'localhost:27017/customer_notes';

module.exports =
{
    "host": "0.0.0.0",
    "port": 3000,
    "db": process.env.DB_IP ,
};
