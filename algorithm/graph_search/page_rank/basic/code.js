/*
	PageRank Algorithm Version 1
	Equation:
		PR (X) = (1 - D) + D (Summation i->X (PR (I) / Out (i)))
	NOTE: Algorithm uses the recommended damping factor (D). Number of iterations is small because only a small Web of 5 Pages is simulated
*/

function arraySum (array) {
	return array.reduce (function (sum, curr) {
		return sum + (curr ? 1 : 0);	//if curr is 0 (no edge) or undefined (loop not allowed), sum remains unchanged
	}, 0);
}

function showOutgoingEdges (i) {
	G [i].forEach (function (edgeExists, j) {
		edgeExists && graphTracer._visit (j, i)._wait () && graphTracer._leave (j, i)._wait ();
	});
}

//PRECOMPUTATIONS

logger._print ('Calculate Outgoing Edge Count for each Node');
(function calculateOEC () {
	var count = 0;
	G.forEach (function (relations, i) {
		outgoingEdgeCounts [i] = arraySum (relations);
		showOutgoingEdges (i);

		oecTracer._notify (i, outgoingEdgeCounts [i])._wait ();
		oecTracer._denotify (i)._wait ();
	});
}) ();

logger._print ('determine incoming nodes for each node');
(function determineIN () {
	for (var i = 0; i < G.length; i++) {
		for (var j = 0; j < G.length; j++) {
			if (G [i] [j]) {
				//there's an edge FROM i TO j
				graphTracer._visit (j, i)._wait ();

				var nextPos = incomingNodes [j].indexOf (-1);
				incomingNodes [j] [nextPos] = i;
				inTracer._notify (j, nextPos, i)._wait ();
				inTracer._denotify (j, nextPos)._wait ();

				graphTracer._leave (j, i)._wait ();
			}
		}
	}

	//logger._print ('All -1s will be removed from incoming node records, they are irrelevant');
	incomingNodes.forEach (function (arr) {
		arr.splice (arr.indexOf (-1));
	});
}) ();

function updateRank (nodeIndex) {
	var inNodeSummation = 0, result;

	logger._print ('Updating rank of ' + nodeIndex);
	logger._print ('The incoming Nodes of ' + nodeIndex + ' are being highlighted');

	incomingNodes [nodeIndex].forEach (function (incoming, i) {
		inTracer._select (nodeIndex, i)._wait ();
		logger._print ('Outgoing edge count of ' + incoming + ' is ' + outgoingEdgeCounts [incoming]);
		oecTracer._select (incoming)._wait ();

		inNodeSummation += (ranks [incoming] / outgoingEdgeCounts [incoming]);

		oecTracer._deselect (incoming)._wait ();
		inTracer._deselect (nodeIndex, i)._wait ();
	});
	logger._print ('In-Node summation of ' + nodeIndex + ' = ' + inNodeSummation);
	
	result = (1 - damping) + (damping * inNodeSummation);
	logger._print ('Therefore, using Equation, new rank of ' + nodeIndex + ' = ' + result);
	return result;
}

var damping = 0.85,
	iterations = 7;
var initialRank = 1.0;

logger._print ('Initialized all Page ranks to ' + initialRank);
ranks = filledArray (G.length, initialRank);

rankTracer._setData (ranks);
logger._print ('Begin execution of PageRank Version #1');
logger._print ('Equation used: PR (X) = (1 - D) + D (In-Node-Summation i->X (PR (I) / Out (i)))');
logger._print ('D = Damping Factor, PR (X) = Page rank of Node X, i = the ith In-Node of X, Out (i) = outgoing Edge Count of i');
logger._print ('');

while (iterations--) {
	for (var node = 0; node < ranks.length; node++) {
		ranks [node] = updateRank (node);
		rankTracer._notify (node, ranks [node])._wait ();
		rankTracer._notify (node)._wait ();
	}
}

logger._print ('Page Ranks have been converged to.')
ranks.forEach (function (rank, node) {
	logger._print ('Rank of Node #' + node + ' = ' + rank);
});
logger._print ('Done');