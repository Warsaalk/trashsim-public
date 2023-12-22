//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
/*
 * Feature			Chrome	Firefox (Gecko)	Internet Explorer	Opera	Safari
 * Basic support	5		4.0 (2.0)		9					10.5	5
 */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}