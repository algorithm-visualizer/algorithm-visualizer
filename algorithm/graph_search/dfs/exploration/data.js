var tracer = new UndirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = UndirectedGraph.random(8, .2);

tracer._setData(G);