var D = Array2D.random(5, 5, 1, 5);
var dataViewer = new Array2DTracer()._setData(D);
var tracer = new Array2DTracer('Results Table');
var logger = new LogTracer();
var DP = [];
for (var i = 0; i < D.length; i++) {
    DP.push([]);
    for (var j = 0; j < D[i].length; j++) {
        DP[i].push(Infinity);
    }
}
tracer._setData(DP);
