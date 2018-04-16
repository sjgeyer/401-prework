// routing
function route(pathname) {
  console.log('About to route a request for ' + pathname);
}

exports.route = route;

// changing route function so it can take and use handle object as parameter
function route(handle, pathname) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname]();
  } else {
    console.log('No request handler found for ' + pathname);
  }
}

exports.route = route;

// returning request handler to server THE WRONG WAY
function route(handle, pathname) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    return handle[pathname]();
  } else {
    console.log('No request handler found for ' + pathname);
    return '404 Not Found';
  }
}

exports.route = route;

// modifying route to take in response as parameter, pass response object on
function route(handle, pathname, response) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
    console.log('No request handler found for ' + pathname);
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('404 Not Found');
    response.end();
  }
}

exports.route = route;

// modify to accept POST data so we can display the content on screen
function route(handle, pathname, response, postData) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    console.log('No request handler found for ' + pathname);
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('404 Not Found');
    response.end();
  }
}

exports.route = route;

// remove postData and replace with request
function route(handle, pathname, response, request) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log('No request handler found for ' + pathname);
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.write('404 Not Found');
    response.end();
  }
}

exports.route = route;