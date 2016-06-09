var tracer = new Array2DTracer().attach(new LogTracer());
var integer = Integer.random(5, 14);
var D = [], A = [];
for (var i = 0; i <= integer; i++) {
  D.push([]);
  D[0][i] = 1;
  D[i][1] = 1;
  for (var j = 0; j <= integer; j++) D[i][j] = 0;
}
tracer._setData(D);