// import visualization libraries {
const { Tracer, Array1DTracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const graphTracer = new GraphTracer().directed(false);
const visitedTracer = new Array1DTracer('visited');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([graphTracer, visitedTracer, logger]));
graphTracer.log(logger);
const G = Randomize.Graph({ N: 8, ratio: .3, directed: false });
graphTracer.set(G);
Tracer.delay();
// }

function DFSExplore(graph, source) {
  const stack = [[source, null]];
  const visited = [];
  let node;
  let prev;
  let i;
  let temp;
  for (i = 0; i < graph.length; i++) {
    visited.push(false);
  }
  // visualize {
  visitedTracer.set(visited);
  // }

  while (stack.length > 0) {
    temp = stack.pop();
    node = temp[0];
    prev = temp[1];

    if (!visited[node]) {
      visited[node] = true;
      // visualize {
      visitedTracer.patch(node, visited[node]);

      if (prev !== undefined && graph[node][prev]) {
        graphTracer.visit(node, prev);
        Tracer.delay();
      } else {
        graphTracer.visit(node);
        Tracer.delay();
      }
      // }

      for (i = 0; i < graph.length; i++) {
        if (graph[node][i]) {
          stack.push([i, node]);
        }
      }
    }
  }

  return visited;
}

const visited = DFSExplore(G, 0);
let check = true;
for (let i = 0; i < visited.length; i++) check &= visited[i];
// logger {
if (check) {
  logger.println('The Graph is CONNECTED');
} else {
  logger.println('The Graph is NOT CONNECTED');
}
// }
