var chart = new ChartTracer();
var tracer = new Array1DTracer().attach(chart);
var logger = new LogTracer();
var D = Array1D.random(10);
tracer._setData(D);
