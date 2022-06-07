// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

const T = [ // mapping to G as a binary tree , [i][0] indicates left child, [i][1] indicates right child
  [-1, -1],
  [0, 2],
  [-1, -1],
  [1, 4],
  [-1, -1],
  [3, 8],
  [-1, 7],
  [-1, -1],
  [6, 10],
  [-1, -1],
  [9, -1],
];

const key = Randomize.Integer({ min: 0, max: G.length - 1 }); // item to be searched
// define tracer variables {
const tracer = new GraphTracer(' Binary Search Tree ');
const logger = new LogTracer(' Log ');
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(G);
tracer.layoutTree(5);
tracer.log(logger);
Tracer.delay();
// }

function bst(item, node, parent) { // node = current node , parent = previous node
  // visualize {
  tracer.visit(node, parent);
  Tracer.delay();
  // }
  if (item === node) { // key found
    // logger {
    logger.println(' Match Found ');
    // }
  } else if (item < node) { // key less than value of current node
    if (T[node][0] === -1) {
      // logger {
      logger.println(' Not Found ');
      // }
    } else {
      bst(item, T[node][0], node);
    }
  } else { // key greater than value of current node
    if (T[node][1] === -1) {
      // logger {
      logger.println(' Not Found ');
      // }
    } else {
      bst(item, T[node][1], node);
    }
  }
}

// logger {
logger.println(`Finding number ${key}`);
// }
bst(key, 5); // node with key 5 is the root
