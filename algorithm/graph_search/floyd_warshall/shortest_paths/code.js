function FloydWarshall(){
  // Finds the shortest path between all nodes
  var S = new Array(G.length);
  for (var i = 0; i < G.length; i++) S[i] = new Array(G.length)
  for (i = 0; i < G.length; i++){
    tracer._visit(i)
    for (var j = 0; j < G.length; j++){
      // Distance to self is always 0
      if (i==j) S[i][i] = 0;
      // Distance between connected nodes is their weight
      else if (G[i][j] > 0){ 
        S[i][j] = G[i][j];
        tracer._visit(j,i,S[i][j]);
        tracer._leave(j,i,S[i][j]);
      }// Else we don't know the distnace and we set it to a big value (infinity)
      else S[i][j] = 19990719; 
    }
    tracer._leave(i)
  }
  // If there is a shorter path using k, use it instead
  for (var k = 0; k < G.length; k++)
      for (i = 0; i < G.length; i++)
        for (j = 0; j < G.length; j++)
          if (S[i][j] > S[i][k] + S[k][j])
            S[i][j] = S[i][k] + S[k][j];
  for (i = 0; i < G.length; i++)
    for (j = 0; j < G.length; j++)
      if(S[i][j] == 19990719) tracer._print('there is no path from ' + i + ' to ' + j);
      else tracer._print('the shortest path from ' + i + 
                         ' to ' + j + ' is ' + S[i][j]);
}
tracer._pace(200);
tracer._print('finding the shortest paths from and to all nodes');
FloydWarshall();