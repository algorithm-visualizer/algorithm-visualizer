// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// G[i][j] indicates whether the path from the i-th node to the j-th node exists or not. NOTE: The graph must be Directed-Acyclic
const G = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 0, 0],
  [1, 1, 0, 0, 0, 0],
];

// define tracer variables {
const tracer = new GraphTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
tracer.set(G);
Tracer.delay();
// }

const inDegrees = Array(...Array(G.length)).map(Number.prototype.valueOf, 0); // create an Array of G.length number of 0s
const Q = [];
let iter = 0;
let i;

// logger {
logger.println('Calculating in-degrees for each Node...');
// }

for (let currNode = 0; currNode < G.length; currNode++) {
  for (let currNodeNeighbor = 0; currNodeNeighbor < G.length; currNodeNeighbor++) {
    if (G[currNode][currNodeNeighbor]) {
      // visualize {
      logger.println(`${currNodeNeighbor} has an incoming edge from ${currNode}`);
      tracer.visit(currNodeNeighbor, currNode);
      Tracer.delay();
      // }
      inDegrees[currNodeNeighbor]++;
      // visualize {
      tracer.leave(currNodeNeighbor, currNode);
      Tracer.delay();
      // }
    }
  }
}
// logger {
logger.println(`Done. In-Degrees are: [ ${String(inDegrees)} ]`);
logger.println('');

logger.println('Initializing queue with all the sources (nodes with no incoming edges)');
// }
inDegrees.map((indegrees, node) => {
  // visualize {
  tracer.visit(node);
  Tracer.delay();
  // }
  if (!indegrees) {
    // logger {
    logger.println(`${node} is a source`);
    // }
    Q.push(node);
  }
  // visualize {
  tracer.leave(node);
  Tracer.delay();
  // }
});
// logger {
logger.println(`Done. Initial State of Queue: [ ${String(Q)} ]`);
logger.println('');
// }

// begin topological sort (kahn)
while (Q.length > 0) {
  // logger {
  logger.println(`Iteration #${iter}. Queue state: [ ${String(Q)} ]`);
  // }
  const currNode = Q.shift();
  // visualize {
  tracer.visit(currNode);
  Tracer.delay();
  // }

  for (i = 0; i < G.length; i++) {
    if (G[currNode][i]) {
      // visualize {
      logger.println(`${i} has an incoming edge from ${currNode}. Decrementing ${i}'s in-degree by 1.`);
      tracer.visit(i, currNode);
      Tracer.delay();
      // }
      inDegrees[i]--;
      // visualize {
      tracer.leave(i, currNode);
      Tracer.delay();
      // }

      if (!inDegrees[i]) {
        // logger {
        logger.println(`${i}'s in-degree is now 0. Enqueuing ${i}`);
        // }
        Q.push(i);
      }
    }
  }
  // visualize {
  tracer.leave(currNode);
  Tracer.delay();
  // }
  // logger {
  logger.println(`In-degrees are: [${String(inDegrees)} ]`);
  logger.println('-------------------------------------------------------------------');
  // }
  
  iter++;
}
