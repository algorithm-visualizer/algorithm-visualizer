function filledArray (length, value) {
	return Array.apply (null, Array (length)).map (Number.prototype.valueOf, value);
}

var G = new DirectedGraph.random (5, 0.4),
	ranks,
	outgoingEdgeCounts = filledArray (G.length, 0),
	incomingNodes;

var graphTracer = new DirectedGraphTracer ('Web Page inter-connections'),
	rankTracer = new Array1DTracer ('Web Page Ranks'),
	oecTracer = new Array1DTracer ('Outgoing Edge Counts'),
	inTracer = new Array2DTracer ('Incoming Nodes');

var logger = new LogTracer ();

graphTracer._setData (G);
oecTracer._setData (outgoingEdgeCounts);

for (incomingNodes = []; incomingNodes.length < G.length; incomingNodes.push (filledArray (G.length, -1)));
inTracer._setData (incomingNodes);