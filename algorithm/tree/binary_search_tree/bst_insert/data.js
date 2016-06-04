var G = [ // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


var T = [ // mapping to G as a binary tree , [i][0] indicates left child, [i][1] indicates right child
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1]
];

var elements = [5,8,10,3,1,6,9,7,2,0,4]; // item to be searched
var tracer = new DirectedGraphTracer( " BST - Elements marked red indicates the current status of tree ");
var tracer2 = new Array1DTracer ( " Elements ")._setData ( elements );
var logger = new LogTracer ( " Log ");
tracer.attach ( logger );