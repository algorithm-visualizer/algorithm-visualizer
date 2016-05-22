function BELLMAN_FORD (src, dest) {
	var weights = new Array (G.length);

	for (var i = 0; i < G.length; i++) {
		weights [i] = MAX_VALUE;
		tracer._weight (i, MAX_VALUE);
	}
	weights [src] = 0;
	tracer._weight (src, 0);

	tracer._print ('Initializing weights to: [' +  weights + ']');
	tracer._print ('');

	//begin BF algorithm execution
	i = G.length - 1;
	while (i--) {
		tracer._print ('Iteration: ' + (G.length - i - 1));
		tracer._print ('------------------------------------------------------------------');

		for (var currentNode = 0; currentNode < G.length; currentNode++) {
			for (var currentNodeNeighbor = 0; currentNodeNeighbor <= G.length; currentNodeNeighbor++) {
				if (G [currentNode] [currentNodeNeighbor]) {	//proceed to relax Edges only if a particular weight != 0 (0 represents no edge)
					tracer._print ('Exploring edge from ' + currentNode + ' to ' + currentNodeNeighbor + ', weight = ' + G [currentNode] [currentNodeNeighbor]);
					tracer._visit (currentNodeNeighbor, currentNode, undefined);

					if ( weights [currentNodeNeighbor] > (weights [currentNode] + G [currentNode] [currentNodeNeighbor]) ) {
						weights [currentNodeNeighbor] = weights [currentNode] + G [currentNode] [currentNodeNeighbor];
						tracer._print ('weights [' + currentNodeNeighbor + '] = weights [' + currentNode + '] + ' + G [currentNode] [currentNodeNeighbor]);
					}

					tracer._leave (currentNodeNeighbor, currentNode, undefined);
				}
			}
		}

		tracer._print ('updated weights: [' +  weights + ']');
		tracer._print ('');
	}

	//check for cycle
	tracer._print ('checking for cycle');
	for (currentNode = 0; currentNode < G.length; currentNode++) {
		for (currentNodeNeighbor = 0; currentNodeNeighbor <= G.length; currentNodeNeighbor++) {
			if (G [currentNode] [currentNodeNeighbor]) {
				if ( weights [currentNodeNeighbor] > (weights [currentNode] + G [currentNode] [currentNodeNeighbor]) ) {
					tracer._print ('A cycle was detected: weights [' + currentNodeNeighbor + '] > weights [' + currentNode + '] + ' + G [currentNode] [currentNodeNeighbor]);
					return (MAX_VALUE);
				}
			}
		}
	}

	tracer._print ('No cycles detected. Final weights for the source ' + src + ' are: [' +  weights + ']');

	return weights [dest];
}

var src = Math.random() * G.length | 0, dest; 
var MAX_VALUE = Infinity;
var minWeight;

/*
	src = start node
	dest = start node (but will eventually at as the end node)
*/

do {
    dest = Math.random() * G.length | 0;
}
while (src === dest);

tracer._pace(100);
tracer._print('finding the shortest path from ' + src + ' to ' + dest);
tracer._sleep(1000);

minWeight = BELLMAN_FORD (src, dest);

if (minWeight === MAX_VALUE) {
    tracer._print('there is no path from ' + src + ' to ' + dest);
} else {
    tracer._print('the shortest path from ' + src + ' to ' + dest + ' is ' + minWeight);
}