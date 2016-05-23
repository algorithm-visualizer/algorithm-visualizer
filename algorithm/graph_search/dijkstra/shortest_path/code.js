function Dijkstra(start, end){
   tracer._sleep(333)
   var minIndex, minDistance;
   var S = []; // S[i] returns the distance from node v to node start
   var D = []; // D[i] indicates whether the i-th node is discovered or not
   for (var i = 0; i < G.length; i++){
      D.push(false);
      S[i] = 19990719 // Some big distance (infinity) 
   }
   S[start] = 0; // Starting node is at distance 0 from itself
   for(var k = 0; k < G.length; k++){
      // Finding a node with the shortest distance from S[minIndex]
      minDistance = 19990719 // Some big distance (infinity)
      for(i = 0; i < G.length; i++){
         if(S[i] < minDistance && !D[i]){
            minDistance = S[i];
            minIndex = i;         
         }
      }
      tracer._visit(minIndex,undefined);
      tracer._sleep(500);
      D[minIndex] = true;
      if(minDistance == 19990719){ // If the distance is big (infinity), there is no more paths
         tracer._print('there is no path from ' + s + ' to ' + e);
         return false;
      }
      // For every unvisited neighbour of current node, we check
      // whether the path to it is shorter if going over the current node 
      for(i = 0; i < G.length; i++){
         if (G[minIndex][i] && !D[i] && ( S[i] > S[minIndex] + G[minIndex][i])){
            S[i] = S[minIndex] + G[minIndex][i];
            tracer._visit(i,minIndex,S[i]);
            tracer._sleep(500);
            tracer._leave(i,minIndex,S[i]);
         }
      }
      tracer._leave(minIndex,undefined);
   }
   tracer._print('the shortest path from ' + s + ' to ' + e + ' is ' + S[e]);
}

var s = Math.random() * G.length | 0; // s = start node
var e; // e = end node
do {
    e = Math.random() * G.length | 0;
} while (s == e);
tracer._pace(100);
tracer._print('finding the shortest path from ' + s + ' to ' + e);
Dijkstra(s, e);