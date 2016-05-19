var tracer = new GraphTracer();
/*var G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
 [0, 1, 1, 1, 0],
 [0, 0, 1, 1, 1],
 [0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1],
 [0, 0, 0, 0, 0]
 ];*/
var G = tracer.createRandomData(5, .3);
tracer.setData(G);