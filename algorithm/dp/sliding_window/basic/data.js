var tracer = new Array1DTracer();
var logger = new LogTracer();
tracer.attach(logger);
var D = Array1D.random(20, -5, 5);
tracer._setData(D);