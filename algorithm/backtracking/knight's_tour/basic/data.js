/*
For N>3 the time taken by this algorithm is sufficiently high
Also it is not possible to visualise for N>6 due to stack overflow 
caused by large number of recursive calls
*/
var N = 3;
var board = new Array (N);
for (var i = board.length - 1; i >= 0; i--) {
	board[i] = new Array (N);
}

for (var i = board.length - 1; i >= 0; i--) {
	for (var j = board[i].length - 1; j >= 0; j--) {
		board[i][j] = -1;
	}
}

/*
Define the next move of the knight
*/
var X = [ 2, 1, -1, -2, -2, -1,  1,  2 ];
var Y = [ 1, 2,  2,  1, -1, -2, -2, -1 ];

var pos = new Array (2);
pos[0] = pos[1] = -1;

var boardTracer = new Array2DTracer ('Board')._setData (board);
var posTracer = new Array1DTracer ('Knight Position')._setData (pos);
var logTracer = new LogTracer ('Console');