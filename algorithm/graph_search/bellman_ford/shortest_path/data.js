var tracer = new WeightedDirectedGraphTracer();
var logger = new LogTracer();
tracer.attach(logger);
var G = [
    [0, -1, 4, 0, 0],
    [0, 0, 3, 2, 2],
    [0, 0, 0, 0, 0],
    [0, 1, 5, 0, 0],
    [0, 0, 0, -3, 0]
];
tracer._setData(G);
