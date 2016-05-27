var tracer = new Array1DTracer();
var logger = new LogTracer();
var A = Array1D.random(10, 0, 10);
var LIS = new Array(A.length);
tracer._setData(A);