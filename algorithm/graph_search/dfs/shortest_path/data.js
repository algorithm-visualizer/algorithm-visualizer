var tracer = new WeightedDirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = WeightedDirectedGraph.random(10, .3, 1, 9);
tracer._setData(G);