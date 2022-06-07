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

function BFS(s) { // s = start node
  const Q = [];
  Q.push(s); // add start node to queue
  // visualize {
  tracer.visit(s);
  Tracer.delay();
  // }
  while (Q.length > 0) {
    const node = Q.shift(); // dequeue
    for (let i = 0; i < G[node].length; i++) {
      if (G[node][i]) { // if current node has the i-th node as a child
        Q.push(i); // add child node to queue
        // visualize {
        tracer.visit(i, node);
        Tracer.delay();
        // }
      }
    }
  }
}

BFS(0);
