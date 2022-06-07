// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new GraphTracer().directed(false).weighted();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
/* let G = [ // G[i][j] indicates the weight of the path from the i-th node to the j-th node
 [0, 3, 0, 1, 0],
 [5, 0, 1, 2, 4],
 [1, 0, 0, 2, 0],
 [0, 2, 0, 0, 1],
 [0, 1, 3, 0, 0]
 ]; */
const G = Randomize.Graph({ N: 10, ratio: .4, directed: false, weighted: true });
tracer.set(G);
Tracer.delay();
// }

function prim() {
  // Finds a tree so that there exists a path between
  // every two nodes while keeping the cost minimal
  let minD;

  let minI;
  let minJ;
  let sum = 0;
  const D = [];
  for (let i = 0; i < G.length; i++) D.push(0);
  D[0] = 1; // First node is visited
  for (let k = 0; k < G.length - 1; k++) { // Searching for k edges
    minD = Infinity;
    for (let i = 0; i < G.length; i++) {
      if (D[i]) // First node in an edge must be visited
      {
        for (let j = 0; j < G.length; j++) {
          if (!D[j] && G[i][j]) {
            // visualize {
            tracer.visit(i, j);
            Tracer.delay();
            // }
            // Second node must not be visited and must be connected to first node
            if (G[i][j] < minD) {
              // Searching for cheapest edge which satisfies requirements
              minD = G[i][j];
              minI = i;
              minJ = j;
            }
            // visualize {
            tracer.leave(i, j);
            Tracer.delay();
            // }
          }
        }
      }
    }
    // visualize {
    tracer.visit(minI, minJ);
    Tracer.delay();
    // }
    D[minJ] = 1; // Visit second node and insert it into or tree
    sum += G[minI][minJ];
  }
  // logger {
  logger.println(`The sum of all edges is: ${sum}`);
  // }
}

// logger {
logger.println('nodes that belong to minimum spanning tree are: ');
// }
prim();
