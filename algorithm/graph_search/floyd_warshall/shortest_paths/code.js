function FloydWarshall() {
  // Finds the shortest path between all nodes
  var S = new Array(G.length);
  for (var i = 0; i < G.length; i++) S[i] = new Array(G.length)
  for (i = 0; i < G.length; i++) {
    for (var j = 0; j < G.length; j++) {
      // Distance to self is always 0
      if (i == j) S[i][i] = 0;
      // Distance between connected nodes is their weight
      else if (G[i][j] > 0) {
        S[i][j] = G[i][j];
      }// Else we don't know the distance and we set it to infinity
      else S[i][j] = MAX_VALUE;
    }
  }
  // If there is a shorter path using k, use it instead
  for (var k = 0; k < G.length; k++) {
    for (i = 0; i < G.length; i++) {
      if (k === i) continue;
      tracer._visit(k, i)._wait();
      for (j = 0; j < G.length; j++) {
        if (i === j || j === k) continue;
        tracer._visit(j, k)._wait();
        if (S[i][j] > S[i][k] + S[k][j]) {
          tracer._visit(j, i, S[i][j])._wait();
          S[i][j] = S[i][k] + S[k][j];
          tracer._leave(j, i, S[i][j]);
        }
        tracer._leave(j, k);
      }
      tracer._leave(k, i)._wait();
    }
  }
  for (i = 0; i < G.length; i++)
    for (j = 0; j < G.length; j++)
      if (S[i][j] === MAX_VALUE) logger._print('there is no path from ' + i + ' to ' + j);
      else logger._print('the shortest path from ' + i + ' to ' + j + ' is ' + S[i][j]);
}
var MAX_VALUE = Infinity;
logger._print('finding the shortest paths from and to all nodes');
FloydWarshall();