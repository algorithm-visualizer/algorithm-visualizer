var chart = new ChartTracer();
var tracer = new Array1DTracer().attach(chart);
var logger = new LogTracer();
var D = Array1D.randomSorted(15, 0, 50);
tracer._setData(D);