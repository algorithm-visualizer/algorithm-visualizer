var tracer = new WeightedGraphTracer();
var G = [
    {3: 1, 4: 2}, // connected nodes from node 0
    {2: 1, 4: 3},
    {1: 4},
    {1: 1},
    {2: 2}
];
tracer.setData(G);