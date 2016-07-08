function randString(length) {
  var result = Math.random().toString(36);
  return result.substring(result.length - length);
}

var string = randString(15);

var startIndex = Math.floor(Math.random() * 10); // Random start index from 0 to 9
var substring = string.substr(startIndex, 5); // Substring of `string` of length 5

//var string = 'abcxabcdabxabcdabcdabxabcda', substring = 'xabcda';
//var string = 'abcxabcdabxabcdabcdabcyiuhsiuhduiahdubhbuuabcdabcysbhbh', substring = 'abcdabcy';

var track = Array.apply(null, Array(substring.length)).map(Number.prototype.valueOf, 0);

var trackTracer = new Array1DTracer('Tracker'),
  substrTracer = new Array1DTracer('Substring'),
  stringTracer = new Array1DTracer('Major String');
var logger = new LogTracer();

trackTracer._setData(track);
substrTracer._setData(substring);
stringTracer._setData(string);
