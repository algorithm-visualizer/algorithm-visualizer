// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const G = [
  [0, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0],
];

// define tracer variables {
const tracer = new GraphTracer().directed(false);
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(G);
Tracer.delay();
// }

// Depth First Search Exploration Algorithm to test connectedness of the Graph (see Graph Algorithms/DFS/exploration), without the tracer & logger commands
function DFSExplore(graph, source) {
  const stack = [[source, null]];
  const visited = {};
  let node;
  let prev;
  let i;
  let temp;

  while (stack.length > 0) {
    temp = stack.pop();
    node = temp[0];
    prev = temp[1];

    if (!visited[node]) {
      visited[node] = true;

      for (i = 0; i < graph.length; i++) {
        if (graph[node][i]) {
          stack.push([i, node]);
        }
      }
    }
  }

  return visited;
}

function findBridges(graph) {
  let tempGraph;
  const bridges = [];
  let visited;

  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph.length; j++) {
      if (graph[i][j]) { // check if an edge exists
        // visualize {
        logger.println(`Deleting edge ${i}->${j} and calling DFSExplore ()`);
        tracer.visit(j, i);
        Tracer.delay();
        tracer.leave(j, i);
        Tracer.delay();
        // }

        tempGraph = JSON.parse(JSON.stringify(graph));
        tempGraph[i][j] = 0;
        tempGraph[j][i] = 0;
        visited = DFSExplore(tempGraph, 0);

        if (Object.keys(visited).length === graph.length) {
          // logger {
          logger.println('Graph is CONNECTED. Edge is NOT a bridge');
          // }
        } else {
          // logger {
          logger.println('Graph is DISCONNECTED. Edge IS a bridge');
          // }
          bridges.push([i, j]);
        }
      }
    }
  }

  return bridges;
}

const bridges = findBridges(G);

// logger {
logger.println('The bridges are: ');
for (const i in bridges) {
  logger.println(`${bridges[i][0]} to ${bridges[i][1]}`);
}
logger.println('NOTE: A bridge is both ways, i.e., from A to B and from B to A, because this is an Undirected Graph');
// }
