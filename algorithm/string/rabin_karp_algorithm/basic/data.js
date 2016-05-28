var text = ['h','e','l','l','o',' ','s','i','r',' ','h','e','l','l','o'];
var pattern = ['h','e','l','l','o'];

var Q = 101; // A prime number 
var D = 256; // number of characters in the input alphabet

var logger = new LogTracer();
var tracer1 = new Array1DTracer('Text')._setData(text);
var tracer2 = new Array1DTracer('Pattern')._setData(pattern);
