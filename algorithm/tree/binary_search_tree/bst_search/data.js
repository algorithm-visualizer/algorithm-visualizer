var G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
];


var T = [ // mapping to G as a binary tree , [i][0] indicates left child, [i][1] indicates right child
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
  [9, -1]
];

var key = Integer.random(0, G.length - 1); // item to be searched
var tracer = new DirectedGraphTracer(" Binary Search Tree ")._setTreeData(G, 5);
var logger = new LogTracer(" Log ");
tracer.attach(logger);