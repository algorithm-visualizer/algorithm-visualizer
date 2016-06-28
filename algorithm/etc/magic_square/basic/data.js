var n = 7;
var A = new Array (n);
for (var i = n - 1; i >= 0; i--) {
	A[i] = new Array (n);
}

for ( var i = n -1; i >= 0; i-- ) {
	for ( var j = n - 1; j >= 0; j-- ) {
		A[i][j] = 0;
	}
}

var tracer = new Array2DTracer ('Magic Square')._setData(A);
var logTracer = new LogTracer ( 'Console' );