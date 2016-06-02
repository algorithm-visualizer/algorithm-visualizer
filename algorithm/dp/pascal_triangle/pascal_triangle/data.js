var N = 9;
var A = new Array (N);
for (var i = N - 1; i >= 0; i--) {
	A[i] = new Array (N);
}

var tracer = new Array2DTracer ('Pascal\'s Triangle')._setData(A);
