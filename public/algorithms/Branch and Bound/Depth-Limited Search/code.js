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
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
tracer.set(G);
tracer.layoutTree(0);
Tracer.delay();
// }

// This is a sample DLS applications where
// we try to find number of descendant of root within some depth
function DLSCount(limit, node, parent) { // node = current node, parent = previous node
  // visualize {
  tracer.visit(node, parent);
  Tracer.delay();
  // }
  let child = 0;
  if (limit > 0) { // cut off the search
    for (let i = 0; i < G[node].length; i++) {
      if (G[node][i]) { // if current node has the i-th node as a child
        child += 1 + DLSCount(limit - 1, i, node); // recursively call DLS
      }
    }
    return child;
  }
  return child;
}

// logger {
logger.println(`Number of descendant is ${DLSCount(2, 0)}`);
// }
