// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

const T = [ // mapping to G as a binary tree , [i][0] indicates left child, [i][1] indicates right child
  [-1, -1],
  [-1, 7],
  [-1, -1],
  [6, 1],
  [-1, -1],
  [3, 8],
  [0, 2],
  [-1, -1],
  [10, 4],
  [-1, -1],
  [9, -1],
];

// define tracer variables {
const treeTracer = new GraphTracer(' Traversal Pre-order ');
const logger = new LogTracer(' Log ');
Layout.setRoot(new VerticalLayout([treeTracer, logger]));
treeTracer.set(G);
treeTracer.layoutTree(5);
Tracer.delay();
// }

function lcaBT(parent, root, a, b) {
  // logger {
  logger.println(`Beginning new Iteration of lcaBT () with parent: ${parent}, current root: ${root}`);
  // }
  if (root === -1) {
    // logger {
    logger.println('Reached end of path & target node(s) not found');
    // }
    return null;
  }

  // visualize {
  if (parent !== null) treeTracer.visit(root, parent);
  else treeTracer.visit(root);
  Tracer.delay();
  // visualize {

  if (root === a || root === b) return root;

  const left = lcaBT(root, T[root][0], a, b);
  const right = lcaBT(root, T[root][1], a, b);

  if (left !== null && right !== null) return root;
  if (left === null && right === null) {
    // visualize {
    treeTracer.leave(root, parent);
    Tracer.delay();
    // }
  }

  return (left !== null ? left : right);
}

const a = 7;
const b = 2;
// logger {
logger.println(`Lowest common ancestor of ${a} & ${b} is: ${lcaBT(null, 5, a, b)}`);
// }
