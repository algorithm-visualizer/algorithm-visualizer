function DFSExplore(graph, source) {
  var stack = [[source, null]], visited = [];
  var node, prev, i, temp;
  for (i = 0; i < graph.length; i++) {
    visited.push(false);
  }
  visitedTracer._setData(visited);

  while (stack.length > 0) {
    temp = stack.pop();
    node = temp [0];
    prev = temp [1];

    if (!visited[node]) {
      visited[node] = true;
      visitedTracer._notify(node, visited[node]);

      if (prev !== undefined && graph[node][prev]) {
        graphTracer._visit(node, prev)._wait();
      } else {
        graphTracer._visit(node)._wait();
      }

      for (i = 0; i < graph.length; i++) {
        if (graph[node][i]) {
          stack.push([i, node]);
        }
      }
    }
  }

  return visited;
}

var visited = DFSExplore(G, 0);
var check = true;
for (var i = 0; i < visited.length; i++) check &= visited[i];
if (check) {
  logger._print('The Graph is CONNECTED');
} else {
  logger._print('The Graph is NOT CONNECTED');
}
