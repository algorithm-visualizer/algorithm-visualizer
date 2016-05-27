/*
	NOTE: Code assumes NO parallel edges
*/

var timer = 0, bridges = [], adj = [];	//adj keeps track of the neighbors of each node

var util = function (u, visited, disc, low, parent) {
	logger._print ('');
	logger._print ('Visiting node ' + u);
	graphTracer._visit (u)._wait ();
	graphTracer._leave (u)._wait ();

	visited [u] = true;
	disc [u] = low [u] = ++timer;

	logger._print ('Nodes adjacent to ' + u + ' are: [ ' + adj [u] + ' ]');
	adj [u].forEach (function (v) {
		graphTracer._visit (v, u)._wait ();
		graphTracer._leave (v, u)._wait ();
	});

	adj [u].forEach (function (v) {
		if (visited [v]) {
			logger._print (u + '\'s neighbor ' + v + ' has already been visited. Not visiting it.');
		}

		if (!visited [v]) {
			logger._print (u + '\'s neighbor ' + v + ' has not been visited yet');
			logger._print ('Setting parent of ' + v + ' to ' + u + ' (parent [v] = u)');

			parent [v] = u;

			logger._print ('recursively calling util (' + v + ', [' + visited + '], [' + disc + '], [' + low + '], [' + parent + '])');
			util (v, visited, disc, low, parent);

			logger._print ('--------------------------------------------------------------------');
			logger._print ('Returned from util (' + v + ', [' + visited + '], [' + disc + '], [' + low + '], [' + parent + '])');
			logger._print ('notice that the values of visited, disc, low and parent might have changed');

			logger._print ('Setting low [' + u + '] to ' + Math.min (low [u], low [v]));
			low [u] = Math.min (low [u], low [v]);

			if (low [v] > disc [u]) {
				logger._print ('low [v] > disc [u], v=' + v + ', u=' + u + ', (' + low [v] + ' > ' + low [u] + ')');
				logger._print (u + ' -> ' + v + ' is a bridge. Adding u->v to the set of bridges found');
				bridges.push ([u, v]);
			}
		}
		else if (v !== parent [u]) {
			logger._print (v + ' does not equal parent [' + u + '] (' + parent [u] + ')');
			logger._print ('Setting low [' + u + '] to ' + Math.min (low [u], disc [v]));
			low [u] = Math.min (low [u], disc [v]);
		}
	});
};

(function findBridges (graph) {
	var visited = filledArray (graph.length, 0);
	var parent = filledArray (graph.length, -1);
	var disc = filledArray (graph.length, 0);
	var low = filledArray (graph.length, 0);

	function filledArray (length, value) {
		return Array.apply (null, Array (length)).map (Number.prototype.valueOf, value);
	}

	//PRECOMPUTATION: store every node's neighbor info in auxiliary array for efficient retrieval later
	(function computeAdj () {
		graph.forEach (function (config) {
			var temp = [];
			config.forEach (function (isEdge, i) {
				isEdge && temp.push (i);
			});
			adj.push (temp);
		});
	}) ();

	for (var i = 0; i < visited.length; i++) { visited [i] = false; }

	logger._print ('Initializing <b>visited</b>: ' + visited + ', <b>parent</b>: ' + parent + ', <b>disc</b>: ' + disc + ' <b>low</b>: ' + low);
	logger._print ('');
	logger._print ('Beginning efficient Bridge Finding');
	logger._print ('NOTE: call to util () follows pattern: util (nodeToVisit, visited, disc, low, parent). See code for clarity');
	logger._print ('');

	logger._print ('Starting the main for loop (for each node)');
	for (var v = 0; v < graph.length; v++) {
		if (!visited [v]) {
			logger._print (v + ' has not been visited yet. Calling util (' + v + ', [' + visited + '], [' + disc + '], [' + low + '], [' + parent + ']) from the for loop');
			util (v, visited, disc, low, parent);
			logger._print ('Returned in for loop after util (' + v + ', [' + visited + '], [' + disc + '], [' + low + '], [' + parent + '])');
		}
	}
}) (G);

logger._print ('There are ' + bridges.length + ' bridges in the Graph');
for (var i = 0; i < bridges.length; i++) {
	logger._print (bridges [i] [0] + '-->' + bridges [i] [1]);
}
logger._print ('NOTE: All bridges are both ways (just like in the Naive Algorithm) because the Graph is undirected. So, edge A->B and B->A, both are bridges');