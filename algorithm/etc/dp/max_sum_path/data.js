var tracer = new Array2DTracer();
var D = Array2D.createRandomData(5, 5, 1, 5);
var DP = [];
for (var i = 0; i < D.length; i++) {
    DP.push([]);
    for (var j = 0; j < D[i].length; j++) {
        DP[i].push(999);
    }
}
tracer._setData(DP);