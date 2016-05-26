//Depth First Search Exploration Algorithm to test connectedness of the Graph (see Graph Algorithms/DFS/exploration), without the tracer & logger commands
function DFSExplore (graph, source) {
	var stack = [ [source, null] ], visited = {};
	var node, prev, i, temp;

	while (stack.length > 0) {
		temp = stack.pop ();
		node = temp [0];
		prev = temp [1];

		if (!visited [node]) {
			visited [node] = true;
			//logger._print (node);

			/*
			if (prev !== undefined && graph [node] [prev]) { tracer._visit (node, prev)._wait (); console.log ('tracer ' + prev + ', ' + node); }
			else { tracer._visit (node)._wait (); console.log ('tracer ' + node); }
			*/

			for (i = 0; i < graph.length; i++) {
				if (graph [node] [i]) {
					stack.push ([i, node]);
				}
			}
		}
	}

	return visited;
}

function findBridges (graph) {
	var tempGraph, bridges = [], visited;

	for (var i = 0; i < graph.length; i++) {
		for (var j = 0; j < graph.length; j++) {
			if (graph [i] [j]) {	//check if an edge exists
				logger._print ('Deleting edge ' + i + '->' + j + ' and calling DFSExplore ()');
				tracer._visit (j, i)._wait ();
				tracer._leave (j, i)._wait ();

				tempGraph = JSON.parse (JSON.stringify (graph));
				tempGraph [i] [j] = 0;
				tempGraph [j] [i] = 0;
				visited = DFSExplore (tempGraph, 0);

				if (Object.keys (visited).length === graph.length) {
					logger._print ('Graph is CONNECTED. Edge is NOT a bridge');
				}
				else {
					logger._print ('Graph is DISCONNECTED. Edge IS a bridge');
					bridges.push ([i,j]);
				}
			}
		}
	}

	return bridges;
}

var bridges = findBridges (G);

logger._print ('The bridges are: ');
for (var i in bridges) {
	logger._print (bridges [i] [0] + ' to ' + bridges [i] [1]);
}
logger._print ('NOTE: A bridge is both ways, i.e., from A to B and from B to A, because this is an Undirected Graph');
