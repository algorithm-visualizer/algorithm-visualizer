/*
	NOTE: Code assumes NO parallel edges
*/

var timer = 0, bridges = [], adj = [];	//adj keeps track of the neighbors of each node

var util = function (u, disc, low, parent) {
	//u is the node that is currently being processed in the DFS (depth-first search)
	//disc is the numbering of the vertices in the DFS, starting at 0
	//low[v] is the lowest numbered vertex that can be reached from vertex v along the DFS
	//parent is the node that u came from
	logger._print ('');
	logger._print ('Visiting node ' + u);
	graphTracer._visit (u)._wait ();
	graphTracer._leave (u)._wait ();

	//visited [u] = true;
	disc [u] = low [u] = timer++;

	logger._print ('Nodes adjacent to ' + u + ' are: [ ' + adj [u] + ' ]');
	/*adj [u].forEach (function (v) {
		graphTracer._visit (v, u)._wait ();
		graphTracer._leave (v, u)._wait ();
	});*/
	var trace = function(v) {
		graphTracer._visit (v, u)._wait ();
		graphTracer._leave (v, u)._wait ();
	}

	adj [u].forEach (function (v) {
		if (disc [v] > -1 && v === parent) {
			trace(v);
			logger._print (u + '\'s neighbor ' + v + ' is u\'s parent. Not visiting it.');

		}
		else if (disc[v] > -1 && v != parent) {
			trace(v);
		    logger._print(u + '\'s neighbor ' + v + ' is not u\'s parent. Comparing low[u] with disc[v]')
		    if(low[u] > disc[v]) {
		        logger._print('low[' + u + '] is greater than disc[' + v + ']. Setting low[' + u + '] to disc[' + v + ']')
		        low[u] = disc[v]
		    }
		}

		if (disc[v] === -1) {
			trace(v);
			logger._print (u + '\'s neighbor ' + v + ' has not been visited yet');

			logger._print ('recursively calling util (' + v + ', [' + disc + '], [' + low + '],' + u + ')');
			util (v, disc, low, u);

			logger._print ('--------------------------------------------------------------------');

			logger._print ('Setting low [' + u + '] to ' + Math.min (low [u], low [v]));
			low [u] = Math.min (low [u], low [v]);

			if (low [v] === disc [v]) {
				logger._print ('low [' + v + '] == disc [' + v + '], low[' + v + ']=' + low[v] + ', disc[' + v + ']=' + disc[v]);
				logger._print (u + ' -> ' + v + ' is a bridge. Adding ' + u + '->' + v + 'to the set of bridges found');
				bridges.push ([u, v]);
			}
		}

	});
};

(function findBridges (graph) {

	var disc = filledArray (graph.length, -1);
	var low = filledArray (graph.length, -1);

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

	logger._print ('Initializing: <b>disc</b>: ' + disc + ' <b>low</b>: ' + low);
	logger._print ('');
	logger._print ('Beginning efficient Bridge Finding');
	logger._print ('NOTE: call to util () follows pattern: util (nodeToVisit, disc, low, parent). See code for clarity');
	logger._print ('');

	logger._print ('Starting the main for loop (for each node)');
	for (var v = 0; v < graph.length; v++) {
		if (disc[v] === -1) {
			logger._print (v + ' has not been visited yet. Calling util (' + v + ',  [' + disc + '], [' + low + '],' + v + ') from the for loop');
			util (v, disc, low, v);
			logger._print ('Returned in for loop after util (' + v + ', [' + disc + '], [' + low + '], [' + v + '])');
		}
	}
}) (G);

logger._print ('There are ' + bridges.length + ' bridges in the Graph');
for (var i = 0; i < bridges.length; i++) {
	logger._print (bridges [i] [0] + '-->' + bridges [i] [1]);
}
logger._print ('NOTE: All bridges are both ways (just like in the Naive Algorithm) because the Graph is undirected. So, edge A->B and B->A, both are bridges');