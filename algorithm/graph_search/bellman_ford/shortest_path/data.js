var tracer = new WeightedDirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = WeightedDirectedGraph.random(5, .5, -2, 5);
tracer._setData(G);
