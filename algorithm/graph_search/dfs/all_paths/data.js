var tracer = new UndirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = UndirectedGraph.random(5, 1);
tracer._setData(G);