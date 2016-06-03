var tracer = new WeightedDirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = WeightedDirectedGraph.random(4, .5);
tracer._setData(G);