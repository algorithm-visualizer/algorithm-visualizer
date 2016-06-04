var N = 4;	//just change the value of N and the visuals will reflect the configuration!
var board = (function createArray (N) {
	var result = [];
	for (var i = 0; i < N; i++) {
		result [i] = Array.apply(null, Array(N)).map(Number.prototype.valueOf,0);
	}
	return result;
}) (N);
var queens = (function qSetup (N) {
	var result = [];
	for (var i = 0; i < N; i++) {
		result [i] = [-1,-1];
	}
	return result;
}) (N);

var boardTracer = new Array2DTracer ('Board'),
	queenTracer = new Array2DTracer ('Queen Positions'),
	logger = new LogTracer ('Progress');

boardTracer._setData (board);
queenTracer._setData (queens);
logger._print ('N Queens: ' + N + 'X' + N + 'matrix, ' + N + ' queens');