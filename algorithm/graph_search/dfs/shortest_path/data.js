var tracer = new WeightedUndirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = WeightedUndirectedGraph.random(5, 1, 1, 9);
tracer._setData(G);