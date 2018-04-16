'use strict';

//passing functions around
function say(word) {
  console.log(word);
}

function execute(someFunction, value) {
  someFunction(value);
}

// passes function 'say' as parameter and 'Hello' as parameter to 'say'
execute(say, 'Hello');

// can also use an anonymous function
execute(function(word){ console.log(word); }, 'Hello');

// asynchronous callback example
// this code is synchronous; does database query and THEN writes to console
var result = database.query('SELECT * FROM hugetable');
console.log('Hello World');

// rewritten of above
// asynchronous; will execute anonymous function WHEN the query is over, but will move onto next line of code in the meantime
database.query('SELECT * FROM hugetable', function(rows) {
  var result = rows;
});
console.log('Hello World');


// example event listeners on request object
// Node serves code the POST data in small chunks/callbacks that are called upon certain events
request.addListener('data', function(chunk) {
  // called when a new chunk of data was received
})

request.addListener('end', function() {
  // called when all chunks of data has been received
})