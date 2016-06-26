var text_tracer = new Array1DTracer('text');
var patt_tracer = new Array1DTracer('pattern');
var concat_tracer = new Array1DTracer('concatenated string');
var tracer = new Array1DTracer('z_array');

//var pattern = "aab";
//var text = "aabxaabxcaabxaabxay";
var pattern = "abc";
var text = "xabcabzabc";
var i;

var len = pattern.length + text.length + 1;

var z = new Array(len);
z[0]=0;

patt_tracer._setData(pattern);
text_tracer._setData(text);
tracer._setData(z);
var logger = new LogTracer();
