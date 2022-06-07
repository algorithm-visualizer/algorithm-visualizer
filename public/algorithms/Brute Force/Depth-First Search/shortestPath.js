// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new GraphTracer().directed(false).weighted();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
const G = Randomize.Graph({ N: 5, ratio: 1, directed: false, weighted: true });
tracer.set(G);
Tracer.delay();
// }

function DFS(node, parent, weight) { // node = current node, parent = previous node
  if (minWeight < weight) return;
  if (node === e) {
    // visualize {
    tracer.visit(node, parent, weight);
    Tracer.delay();
    // }
    if (minWeight > weight) {
      minWeight = weight;
    }
    // visualize {
    tracer.leave(node, parent, minWeight);
    Tracer.delay();
    // }
    return;
  }
  D[node] = true; // label current node as discovered
  // visualize {
  tracer.visit(node, parent, weight);
  Tracer.delay();
  // }
  for (let i = 0; i < G[node].length; i++) {
    if (G[node][i]) { // if the path from current node to the i-th node exists
      if (!D[i]) { // if the i-th node is not labeled as discovered
        DFS(i, node, weight + G[node][i]); // recursively call DFS
      }
    }
  }
  D[node] = false; // label current node as undiscovered
  // visualize {
  tracer.leave(node, parent, 0);
  Tracer.delay();
  // }
}

const s = Randomize.Integer({ min: 0, max: G.length - 1 }); // s = start node
let e; // e = end node
do {
  e = Randomize.Integer({ min: 0, max: G.length - 1 });
} while (s === e);
const MAX_VALUE = Infinity;
let minWeight = MAX_VALUE;
// logger {
logger.println(`finding the shortest path from ${s} to ${e}`);
// }
let D = []; // D[i] indicates whether the i-th node is discovered or not
for (let i = 0; i < G.length; i++) D.push(false);
DFS(s, undefined, 0);
// logger {
if (minWeight === MAX_VALUE) {
  logger.println(`there is no path from ${s} to ${e}`);
} else {
  logger.println(`the shortest path from ${s} to ${e} is ${minWeight}`);
}
// }
