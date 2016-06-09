var string = 'hello! how are you doing?';
var rotation = 5;
var alphabet = 'abcdefghijklmnopqrstuvwxyz';
// create a map of char -> position to improve run time
// otherwise we would have to search the alphabet each 
// time to find the character position
var alphabetMap = alphabet.split('').reduce(function(map, curr, idx) {
  map[curr] = idx;
  return map;
}, {});

var encryptTracer = new Array1DTracer('Encryption');
var decryptTracer = new Array1DTracer('Decryption');
var logger = new LogTracer();

encryptTracer._setData(string);