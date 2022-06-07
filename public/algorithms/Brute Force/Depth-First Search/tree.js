// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// define tracer variables {
const tracer = new GraphTracer();
const logger = new LogTracer();
tracer.log(logger);
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(G);
tracer.layoutTree(0);
Tracer.delay();
// }

function DFS(node, parent) { // node = current node, parent = previous node
  // visualize {
  tracer.visit(node, parent);
  Tracer.delay();
  // }
  for (let i = 0; i < G[node].length; i++) {
    if (G[node][i]) { // if current node has the i-th node as a child
      DFS(i, node); // recursively call DFS
    }
  }
}

DFS(0);
