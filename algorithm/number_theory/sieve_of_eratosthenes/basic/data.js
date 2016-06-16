var tracer = new Array1DTracer('Sieve');
var N = 30;
var a = [];
var b = [];
for (var i = 1; i <= N; i++) {
  a.push(i);
  b.push(0);
}
tracer._setData(a);
var logger = new LogTracer();
