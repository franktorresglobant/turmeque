/**
 * @author Frank Torres <torresriverafrank@gmail.com>
 * @version 1.0.0
 */
'use strict';
process.env.NODE_ENV = 'client';
var express = require("express");
var fallback = require('express-history-api-fallback');
var bodyParser = require("body-parser");
var cors = require('cors');
var ROUTES = require('./routes/ROUTES').ROUTES();

/**
 * internal dependencies
 */
const config = require('./config/config');
const LoggerService = require('./services/logger.service');
const CustomerRoute = require('./routes/customer/customer.route');
const NotesRoute = require('./routes/notes/notes.routes');

var app = express();

const hostname = config.host;
const port = config.port;
const applicationDir = __dirname + '/../';
const apiDocFilesPath = 'doc';
const fronFilesPath = process.env.NODE_ENV === 'production' ? 'build' : 'client';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/' + apiDocFilesPath, express.static(applicationDir + apiDocFilesPath));
app.use(cors());

new CustomerRoute(app);
new NotesRoute(app);

app.use(fallback('index.html', { root: applicationDir + fronFilesPath }));

app.listen(port, hostname, function () {
  LoggerService.log('info', `Server running at http://${hostname}:${port}/`);
});