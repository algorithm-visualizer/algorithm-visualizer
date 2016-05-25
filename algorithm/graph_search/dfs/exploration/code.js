function DFSExplore (graph, source) {
	var stack = [ [source, null] ], visited = {};
	var node, prev, i, temp;

	while (stack.length > 0) {
		temp = stack.pop ();
		node = temp [0];
		prev = temp [1];

		if (!visited [node]) {
			visited [node] = true;
			logger._print (node);

			if (prev !== undefined && graph [node] [prev]) { tracer._visit (node, prev)._wait (200); console.log ('tracer ' + prev + ', ' + node); }
			else { tracer._visit (node)._wait (200); console.log ('tracer ' + node); }

			for (i = 0; i < graph.length; i++) {
				if (graph [node] [i]) {
					stack.push ([i, node]);
				}
			}
		}
	}

	return visited;
}


var visited = DFSExplore (G, 0);
if (G.length === Object.keys (visited).length) {
	logger._print ('The Graph is CONNECTED');
}
else {
	logger._print ('The Graph is NOT CONNECTED');
}