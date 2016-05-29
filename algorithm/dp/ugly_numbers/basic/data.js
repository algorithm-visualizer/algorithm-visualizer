var N = 15;
var A = new Array(N);
for (var i = N - 1; i >= 0; i--) {
	A[i] = 0;
}
A[0] = 1; // By convention 1 is an ugly number

var M = [2,3,5]; // multiples of 2, 3, 5 respectively
var I = [0,0,0]; // iterators of 2, 3, 5 respectively

var tracer = new Array1DTracer('Ugly Numbers')._setData(A);
var tracer2 = new Array1DTracer('Multiples of 2, 3, 5')._setData(M);
var tracer3 = new Array1DTracer(' Iterators I0, I1, I2 ')._setData(I);
var logger = new LogTracer();