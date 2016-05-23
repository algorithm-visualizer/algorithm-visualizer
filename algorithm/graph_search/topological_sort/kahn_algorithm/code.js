tracer._pace(100);
tracer._sleep(1000);

(function topologicalSort () {
	var inDegrees = Array.apply (null, Array (G.length)).map (Number.prototype.valueOf, 0);		//create an Array of G.length number of 0s
	var Q = [], iter = 0, i;

	tracer._print ('Calculating in-degrees for each Node...');
	for (var currNode = 0; currNode < G.length; currNode++) {
		for (var currNodeNeighbor = 0; currNodeNeighbor < G.length; currNodeNeighbor++) {
			if (G [currNode] [currNodeNeighbor]) {
				tracer._print (currNodeNeighbor + ' has an incoming edge from ' + currNode);
				tracer._visit (currNodeNeighbor, currNode);
				inDegrees [currNodeNeighbor]++;
				tracer._leave (currNodeNeighbor, currNode);
			}
		}
	}
	tracer._print ('Done. In-Degrees are: [ ' + String (inDegrees) + ' ]');
	tracer._print ('');

	tracer._print ('Initializing queue with all the sources (nodes with no incoming edges)');
	inDegrees.map (function (indegrees, node) {
		tracer._visit (node);
		if (!indegrees) {
			tracer._print (node + ' is a source');
			Q.push (node);
		}
		tracer._leave (node);
	});
	tracer._print ('Done. Initial State of Queue: [ ' + String (Q) + ' ]');
	tracer._print ('');

	//begin topological sort (kahn)
	while (Q.length > 0) {
		tracer._print ('Iteration #' + iter + '. Queue state: [ ' + String (Q) + ' ]');
		currNode = Q.shift (1);
		tracer._visit (currNode);

		for (i = 0; i < G.length; i++) {
			if (G [currNode] [i]) {
				tracer._print (i + ' has an incoming edge from ' + currNode + '. Decrementing ' + i + '\'s in-degree by 1.');
				tracer._visit (i, currNode);
				inDegrees [i]--;
				tracer._leave (i, currNode);

				if (!inDegrees [i]) {
					tracer._print (i + '\'s in-degree is now 0. Enqueuing ' + i);
					Q.push (i);
				}
			}
		}
		tracer._leave (currNode);
		tracer._print ('In-degrees are: [' + String (inDegrees) + ' ]');
		tracer._print ('-------------------------------------------------------------------');

		iter++;
	}
}) ();