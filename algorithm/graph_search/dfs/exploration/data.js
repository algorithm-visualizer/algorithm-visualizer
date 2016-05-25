var tracer = new UndirectedGraphTracer ();
var logger = new LogTracer ();
var G = [
	[0,1,0,0,0,0],
	[1,0,0,1,1,0],
	[0,0,0,1,0,0],
	[0,1,1,0,1,1],
	[0,1,0,1,0,0],
	[0,0,0,1,0,0]
];

tracer._setData (G);