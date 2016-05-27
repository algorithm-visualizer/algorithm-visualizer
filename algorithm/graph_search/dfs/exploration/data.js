var tracer = new UndirectedGraphTracer();
var logger = new LogTracer();
var G = UndirectedGraph.random(8, .2);

tracer._setData(G);