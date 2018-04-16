'use strict';

// allows us to wire request handlers into the router
function start() {
  console.log('Request handler "start" was called.');
}

function upload() {
  console.log('Request handler "upload" was called.');
}

exports.start = start;
exports.upload = upload;

// handling requests THE WRONG WAY
function start() {
  console.log('Request handler "start" was called.');
  return 'Hello Start';
}

function upload() {
  console.log('Request handler "upload" was called.');
  return 'Hello Upload';
}

exports.start = start;
exports.upload = upload;

// modifying to add blocking operation (wait 10 seconds before returning)
// will make all requests take 10 seconds because start() contains a blocking operation
function start() {
  console.log('Request handler "start" was called.');

  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  sleep(10000);
  return 'Hello Start';
}

function upload() {
  console.log('Request handler "upload" was called.');
  return 'Hello Upload';
}

exports.start = start;
exports.upload = upload;

// modify to remove blocking operation/introduce non-blocking operation
// executes shell command from within Node.js to get list of files from current directory
// still needs to make use of a callback function because exec is asynchronous
var exec = require('child_process').exec;

function start() {
  console.log('Request handler "start" was called.');
  var content = 'empty';

  exec('ls -lah', function(error, stdout, stderr) {
    content = stdout;
  });
  return content;
}

function upload() {
  console.log('Request handler "upload" was called.');
  return 'Hello Upload';
}

exports.start = start;
exports.upload = upload;

// modify to take in response from server and write accordingly
// start handler responds from anonymous exec() callback, upload handler remains the same, but now makes use of response object
var exec = require('child_process').exec;

function start(response) {
  console.log('Request handler "start" was called.');

  exec('ls -lah', function(error, stdout, stderr) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write(stdout);
    response.end();
  });
}

function upload(response) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello Upload');
  response.end();
}

exports.start = start;
exports.upload = upload;

// modifying to proive expensive operation behind start will no longer block requests for '/upload'
// requests to start will take at least 10 seconds, requests to upload will be answered immediately
var exec = require('child_process').exec;

function start(response) {
  console.log('Request handler "start" was called.');

  exec('find /',
    { timeout: 10000, maxBuffer: 20000*1024 },
    function(error, stdout, stderr) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write(stdout);
      response.end();
    });
}

function upload(response) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello Upload');
  response.end();
}

exports.start = start;
exports.upload = upload;

// adding textarea form to /start request handler
function start(response) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello Upload');
  response.end();
}

exports.start = start;
exports.upload = upload;

// include POST data into handler
function start(response, postData) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, postData) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('You have sent: ' + postData);
  response.end();
}

exports.start = start;
exports.upload = upload;

// modify to pass only text field portion of POST data instead of whole body
var querystring = require('querystring');

function start(response, postData) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, postData) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('You have sent the text: ' + querystring.parse(postData).text);
  response.end();
}

exports.start = start;
exports.upload = upload;

// modify to include image upload
var querystring = require('querystring'),
  fs = require('fs');

function start(response, postData) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, postData) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('You have sent the text: ' + querystring.parse(postData).text);
  response.end();
}

function show(response) {
  console.log('Request handler "show" was called.');
  response.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('/tmp/test.png').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;

// modify to add encoding type of multipart/form-data to HTML form, remove textarea, add file upload input field, change submit button to 'Upload File'
var querystring = require('querystring'),
  fs = require('fs');

function start(response, postData) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, postData) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('You have sent the text: ' + querystring.parse(postData).text);
  response.end();
}

function show(response) {
  console.log('Request handler "show" was called.');
  response.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('/tmp/test.png').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;

// remove postData handling and setEncoding line, pass request to router itself
var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received.');
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;

// need to delete/rename the image file
var querystring = require('querystring'),
  fs = require('fs'),
  formidable = require('formidable');

function start(response) {
  console.log('Request handler "start" was called.');

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, request) {
  console.log('Request handler "upload" was called.');

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(request, function(error, fields, files) {
    console.log('parsing done');

    // possible error here on Windows systems, tried to rename existing file
    fs.rename(files.upload.path, '/tmp/test.png', function(error) {
      if (error) {
        fs.unlink('/tmp/test.png');
        fs.rename(files.upload.path, '/tmp/test.png');
      }
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('received image:<br/>');
    response.write('<img src="/show" />');
    response.end();
  });
}

function show(response) {
  console.log('Request handler "show" was called.');
  response.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('/tmp/test.png').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;