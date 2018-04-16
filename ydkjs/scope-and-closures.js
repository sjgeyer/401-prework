'use strict';

console.log(a);
a = 2;

function foo(a) {
  console.log(a);
}

foo(2);

// Quiz:
// LHS lookups: existence of variables, result from assignment operations
// RHS lookups: retrieving value of variables

// 1. LHS lookups: foo (function), a (implicit declaration), c (foo...)
// 2. RHS lookups: foo = {...}, b = a, a = 2, c = a + b

// RHS lookup of b within foo()
function foo(a) {
  console.log(a + b);
}
var b = 2;
foo(2);

// b is declared after it is referenced, throws ReferenceError
// global scope can create variable if it does not exist, if not operating in 'Strict Mode'
// ReferenceError: scope resolution failure, unfulfilled RHS reference
// TypeError: scope resolution was successful, but an impossible action was attempted
function foo(a) {
  console.log(a+ b);
  b = a;
}
foo(2);

// lexical scope of variable is defined only by where the function was declared
// scope lookup stops once a match is found
function foo(a) {           // scope 1 - global (foo)
  var b = a * 2;            // scope 2 - foo (a, bar, b)
  function bar(c) {
    console.log(a, b, c);   // scope 3 - bar (c)
  }
  bar(b * 3);
}
foo(2);

// eval function: programmatically generates code inside of authored code, runs generated code as if it had been there at author time
// cheats lexical scope
function foo(str, a) {
  eval(str);
  console.log(a, b);
}
var b = 2;
foo('var b = 3;', 1);

// eval does not modify enclosing scope when in strict mode
function foo(str) {
  'use strict';
  eval(str);
  console.log(a);
}
foo('var a = 2');

// with: shorthand for multiple property references against an object without repeating the object reference itself each time
// creates a whole new lexical scope from the object you pass to it
var obj = {
  a: 1,
  b: 2,
  c: 3
};

obj.a = 2;
obj.b = 3;
obj.c = 4;

with (obj) {
  a = 3;
  b = 4;
  c = 5;
}

function foo(obj) {
  with (obj) {
    a = 2;
  }
}

var o1 = {
  a: 3
};

var o2 = {
  b: 3
};

foo(o1);
console.log(o1.a);

foo(o2);
console.log(o2.a);
console.log(a);

function foo(a) {
  var b = 2;
  // some code
  function bar() {
    // code
  }
  // code
  var c = 3;
}

bar();
console.log(a, b, c);

// playing with scope - both functions global
function doSomething(a) {
  b = a + doSomethingElse (a * 2);
  console.log(b * 3);
}

function doSomethingElse(a) {
  return a - 1;
}

var b;

doSomething(2);

// hiding one function in another
function doSomething(a) {
  function doSomethingElse(a) {
    return a - 1;
  }
  var b;
  b = a + doSomethingElse(a * 2);
  console.log(b * 3);
}
doSomething(2);

// hide variables inside of functions
// will be an infinite loop because i declared in bar overwrites the for loop i
function foo() {
  function bar(a) {
    i = 3;
    console.log(a + 1);
  }
  for (var i = 0; i < 10; i++) {
    bar(i * 2);
  }
}
foo();

// global namespaces
var MyReallyCoolLibrary = {
  awesome: 'stuff',
  doSomething: function() {
    // ...
  },
  doAnotherThing: function() {
    // ...
  }
}

// function name is still 'polluting' enclosing scope, still need to call the function by name for the code to execute
var a = 2;
function foo() {
  var a = 3;
  console.log(a);
}
foo();

// better way, treats function as function expression instead of function declaration
var a = 2;
(function foo() {
  var a = 3;
  console.log(a);
})
console.log(a);

// anonymous function example, can only be for function expressions
setTimeout(function(){
  console.log('I waited 1 second!');
}, 1000);

// inline function expressions
setTimeout(function timeoutHandler(){
  console.log('I waited 1 second!');
}, 1000);

// IIFEs: invoking function expressions immediately
var a = 2;
(function foo(){
  var a = 3;
  console.log(a);
})();
console.log(a);

// passing in arguments to IIFEs
var a = 2;
(function IIFE(global){
  var a = 3;
  console.log(a);
  console.log(global.a);
})(window);
console.log(a);

// using undefined as a parameter??
undefined = true;
(function IIFE(undefined){
  var a;
  if (a === undefined) {
    console.log('Undefined is safe here!');
  }
})();

// function to execute given second, after invocation and parameters
var a = 2;
(function IIFE(def){
  def(window);
})(function def(global){
  var a = 3;
  console.log(a);
  console.log(global.a);
});

// block scoping - not real
var foo = true;
if (foo) {
  var bar = foo * 2;
  bar = something(bar);
  console.log(bar);
}

// block scoping using try/catch
try {
  undefined();
}
catch (err) {
  console.log(err);
}
console.log(err);

// let - block scoped
var foo = true;
if (foo) {
  let bar = foo * 2;
  bar = something(bar);
  console.log(bar);
}
console.log(bar);

// explicit blocking
var foo = true;
if (foo) {
  {
    let bar = foo *2;
    bar = something(bar);
    console.log(bar);
  }
}
console.log(bar);

// let does not hoist
{
  console.log(bar);
  let bar = 2;
}

// garbage collection
function process(data) {
  // do something
}
var someReallyBigData = { .. };
process(someReallyBigData);

var btn = document.getElementById('my_button');
btn.addEventListener('click', function click(evt){
  console.log('button clicked');
}, false);

// block scoping to clear out large unneeded data
function process(data) {
  // do something
}
{
  let someReallyBigData = { .. };
  process(someReallyBigData);
}
var btn = document.getElementById('my_button');
btn.addEventListener('click', function click(evt){
  console.log('button clicked');
}, false);

// using let in a for loop
for (let i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i);

// re-binding to each iteration of the loop
{
  let j;
  for (j = 0; j < 10; j++) {
    let i = j;
    console.log(i);
  }
}

// let attaches to arbitrary blocks, can run into issues when switching from var to let
var foo = true, baz = 10;
if (foo) {
  var bar = 3;
  if (baz > bar) {
    console.log(baz);
  }
  // ...
}

// refactored to...
var foo = true, baz = 10;
if (foo) {
  var bar = 3;
  // ...
}
if (baz > bar) {
  console.log(baz);
}

// refactored to...
var foo = true; baz = 10;
if (foo) {
  let bar = 3,
  if (baz > bar) {
    console.log(baz);
  }
}

// using const - no reassignment
var foo = true;
if (foo) {
  var a = 2;
  const b = 3;
  a = 3;
  b = 4;
}
console.log(a);
console.log(b);

// hoisting!
a = 2;
var a;
console.log(a);

console.log(a);
var a = 2;

foo();
function foo() {
  console.log(a);
  var a = 2;
}

// only function declarations are hoisted
foo();
var foo = function bar() {
  // ...
};

// functions are hoisted first, then variables
foo();
function foo() {
  console.log(1);
}
var foo = function() {
  console.log(2);
}
function foo() {
  console.log(3);
}

// function declarations inside normal blocks hoist to enclosing scope, rather than being conditional
foo();
var a = true;
if (a) {
  function foo() { console.log('a'); }
} else {
  function foo() { console.log('b'); }
}