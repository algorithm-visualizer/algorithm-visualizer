var tracer = new Array2DTracer();
var logger = new LogTracer();
var k = Array1D.random(10, 1, 999);
var D = [
    k,
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
tracer._setData(D);
