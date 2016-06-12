var maxValue = 9;
var arrSize = 10;

//initialize array values
var A = Array1D.random(arrSize, 0, maxValue);
var counts = [];
var sortedA = [];
for (let i = 0; i <= maxValue; i++) {
    counts[i] = 0;
    if (i < arrSize) sortedA[i] = 0;
}
var D = [
    A,
    counts,
    sortedA
];

var tracer = new Array2DTracer();
tracer._setData(D);
