var tracer = new Array1DTracer('Seive');
var length = 30;
var a = [];
var b = [];
for (var i = 1; i <= length; i++) {
  a.push(i);
  b.push(0);
}
tracer._setData(a);
var logger = new LogTracer();
