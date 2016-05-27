var tracer = new Array2DTracer().attach(new LogTracer());
var integer = Math.floor(Math.random() * 10) + 5;
var D = [], A = [];
for (var i = 0; i <= integer; i++){
  D.push([]);
  D[0][i] = 1;
  D[i][1] = 1;
  for (var j = 0; j <= integer; j++) D[i][j]=0;
}
tracer._setData(D);