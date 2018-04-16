'use strict';

var server = require('./server');

server.start();

// in command line:
node index.js

// extending index to include server and router
var server = require('./server');
var route = require('./router');

server.start(router.route);

// putting object together to pass into route()
var server = require('./server');
var route = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;

server.start(router.route, handle);

// add new request handler
var server = require('./server');
var route = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

server.start(router.route, handle);