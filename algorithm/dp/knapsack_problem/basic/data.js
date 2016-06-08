var val = [1,4,5,7]; // The value of all available items
var wt = [1,3,4,5];  // The weights of available items
var W = 7;           // The maximum weight we can carry in our collection
var N = val.length;
var DP = new Array(N+1);

for (var i = 0; i < N + 1; i++) {
    DP[i] = new Array(W+1);
    for (var j = 0; j < W + 1; j++) {
        DP[i][j] = 0;
    }
}

var tracer = new Array2DTracer('Knapsack Table')._setData(DP);
var dataViewer1 = new Array1DTracer('Values')._setData(val);
var dataViewer2 = new Array1DTracer('Weights')._setData(wt);
var logger = new LogTracer();
