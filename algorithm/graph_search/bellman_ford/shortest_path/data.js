var tracer = new DirectedGraphTracer();
//var G = WeightedGraph.random( (Math.random () * 10) | 0, .3, -9, 9);
var G = [
	[0,-1,4,0,0],
	[0,0,3,2,2],
	[0,0,0,0,0],
	[0, 1,5,0,0],
	[0,0,0,-3,0]
];

tracer._setData(G);