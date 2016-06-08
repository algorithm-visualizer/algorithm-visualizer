var graphTracer = new UndirectedGraphTracer();
var visitedTracer = new Array1DTracer('visited');
var logger = new LogTracer();
graphTracer.attach(logger);
var G = UndirectedGraph.random(8, .3);
graphTracer._setData(G);