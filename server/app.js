/**
 * @author Frank Torres <torresriverafrank@gmail.com>
 * @version 1.0.0
 */
'use strict';
process.env.NODE_ENV = 'client';
var express = require("express");
var fallback = require('express-history-api-fallback');
var bodyParser = require("body-parser");

/**
 * internal dependencies
 */
var config = require('./config/config');
var LoggerService = require('./services/logger.service');
var CustomerRoute = require('./routes/customer/customer.route');
var NotesRoute = require('./routes/notes/notes.routes');

var app = express();

const hostname = config.host;
const port = config.port;
const applicationDir = __dirname + '/../';
const apiDocFilesPath = 'doc';
const fronFilesPath = process.env.NODE_ENV === 'production' ? 'build' : 'client';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fallback('index.html', { root: applicationDir + fronFilesPath }));

new CustomerRoute(app);
new NotesRoute(app);

app.listen(port, hostname, function () {
  LoggerService.log('info', `Server running at http://${hostname}:${port}/`);
});