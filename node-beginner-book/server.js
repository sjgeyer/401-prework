'use strict';

// requires http module ships with Node.js and makes it accessible through 'http'
var http = require('http');

// function in http module, returns object with method 'listen', passes createServer an anonymous function
http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}).listen(8888);

// other server method -- starts server listening at 8888 but does nothing else
var http = require('http');
var server = http.createServer();
server.listen(8888);

// passing createServer a non-anonymous function
function onRequest(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}

http.createServer(onRequest).listen(8888);

// testing asynchronous functions:
function onRequest(request, response) {
  console.log('Request received.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}

http.createServer(onRequest).listen(8888);

console.log('Server has started.');

// wrapping server in module
function start() {
  function onRequest(request, response) {
    console.log('Request received.');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// finding which path the browser requested
var http = require('http');
var url = require('url');

function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// extending start function to enable us to pass the route function to be used by parameter:
var http = require('http');
var url = require('url');

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');

    route(pathname);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// pass handle object into server as additional parameter
var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');

    route(handle, pathname);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// make server respond to browser with content returned from request handlers via router THE WRONG WAY
var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');

    response.writeHead(200, {'Content-Type': 'text/plain'});
    var content = route(handle, pathname);
    response.write(content);
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// need to pass the response object through the router into the request handlers; handlers can then use the object's functions to respond to requests themselves
// pass response into route function, remove response method calls from onRequest handler, because route() will now take care of that
var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');

    route(handle, pathname, response);
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// modify to put data and end callbacks
// collect all POST data chunks in data callback, call router upon receiving end event, pass collected data on to the router --> on to request handlers
var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var postData = '';
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');

    // define that we want the encoded data to be UTF-8
    request.setEncoding('utf8');

    // event listener for data event
    request.addListener('data', function(postDataChunk) {
      postData += postDataChunk;
      console.log('Received POST data chunk: ' + postDataChunk);
    });

    // calling router and pass POST data
    request.addListener('end', function() {
      route(handle, pathname, response, postData);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// modify to include formidable
var formidable = require('formidable'),
  http = require('http'),
  sys = require('sys');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    //parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload: \n\n');
      res.end(sys.inspect({fields: fields, files: files}));
    });
    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8888);