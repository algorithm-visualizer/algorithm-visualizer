var G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
];


var T = [ // mapping to G as a binary tree , [i][0] indicates left child, [i][1] indicates right child
        [-1,-1],
        [-1, 7],
        [-1,-1],
        [ 6, 1],
        [-1,-1],
        [ 3, 8],
        [ 0, 2],
        [-1,-1],
        [10, 4],
        [-1,-1],
        [ 9,-1]
];

var treeTracer = new DirectedGraphTracer( " Traversal Pre-order ")._setTreeData ( G, 5 );
var logger = new LogTracer ( " Log ");