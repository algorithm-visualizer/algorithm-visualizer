var graphTracer = new UndirectedGraphTracer ();
var logger = new LogTracer ();
var G = [
	[0,1,0,0,1,0],
	[1,0,0,0,1,0],
	[0,0,0,1,0,0],
	[0,0,1,0,1,1],
	[1,1,0,1,0,0],
	[0,0,0,1,0,0]
];

graphTracer._setData (G);