var tracer = new DirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = DirectedGraph.random(4, .75);
tracer._setData(G);