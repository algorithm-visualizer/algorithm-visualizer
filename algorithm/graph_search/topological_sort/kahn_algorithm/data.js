var tracer = new DirectedGraphTracer ();
// G[i][j] indicates whether the path from the i-th node to the j-th node exists or not. NOTE: The graph must be Directed-Acyclic
var G = [
	[0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 1, 0, 0, 0, 0]
];

tracer._setData (G);