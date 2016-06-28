var A = Array1D.random(7);
var N = A.length;

var tracer1 = new Array1DTracer ( 'Array' )._setData ( A );
var tracer2 = new Array2DTracer ( 'Holes' );
var logTracer = new LogTracer ( 'Console' );