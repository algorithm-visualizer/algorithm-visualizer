var tracer = new GraphTracer();
var G = [
    [1,2,3,4], // connected nodes from node 0
    [0,2,3,4],
    [0,1,3,4],
    [0,1,2,4],
    [0,1,2,3]
];
tracer.setData(G);