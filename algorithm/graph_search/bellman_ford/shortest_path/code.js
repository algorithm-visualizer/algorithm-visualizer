function BELLMAN_FORD(src, dest) {
  var weights = new Array(G.length), i, j;

  for (i = 0; i < G.length; i++) {
    weights[i] = MAX_VALUE;
    tracer._weight(i, weights[i]);
  }
  weights[src] = 0;
  tracer._weight(src, 0);

  logger._print('Initializing weights to: [' + weights + ']');
  logger._print('');

  //begin BF algorithm execution
  var k = G.length;
  while (k--) {
    logger._print('Iteration: ' + (G.length - k));
    logger._print('------------------------------------------------------------------');

    for (i = 0; i < G.length; i++) {
      for (j = 0; j < G.length; j++) {
        if (G[i][j]) {	//proceed to relax Edges only if a particular weight != 0 (0 represents no edge)
          if (weights[j] > (weights[i] + G[i][j])) {
            weights[j] = weights[i] + G[i][j];
            logger._print('weights[' + j + '] = weights[' + i + '] + ' + G[i][j]);
          }
          tracer._visit(j, i, weights[j])._wait();
          tracer._leave(j, i)._wait();
        }
      }
    }

    logger._print('updated weights: [' + weights.join(', ') + ']');
    logger._print('');
  }

  //check for cycle
  logger._print('checking for cycle');
  for (i = 0; i < G.length; i++) {
    for (j = 0; j < G.length; j++) {
      if (G[i][j]) {
        if (weights[j] > (weights[i] + G[i][j])) {
          logger._print('A cycle was detected: weights[' + j + '] > weights[' + i + '] + ' + G[i][j]);
          return (MAX_VALUE);
        }
      }
    }
  }

  logger._print('No cycles detected. Final weights for the source ' + src + ' are: [' + weights + ']');

  return weights[dest];
}

var src = Integer.random(0, G.length - 1), dest;
var MAX_VALUE = Infinity;
var minWeight;

/*
 src = start node
 dest = start node (but will eventually at as the end node)
 */

do {
  dest = Integer.random(0, G.length - 1);
}
while (src === dest);

logger._print('finding the shortest path from ' + src + ' to ' + dest);

minWeight = BELLMAN_FORD(src, dest);

if (minWeight === MAX_VALUE) {
  logger._print('there is no path from ' + src + ' to ' + dest);
} else {
  logger._print('the shortest path from ' + src + ' to ' + dest + ' is ' + minWeight);
}