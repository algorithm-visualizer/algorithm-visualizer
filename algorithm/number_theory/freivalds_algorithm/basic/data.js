var A = [[2,3],[3,4]];
var B = [[1,0],[1,2]];
var C = [[6,5],[8,7]];

var _a = new Array2DTracer('Matrix A'); _a._setData(A);
var _b = new Array2DTracer('Matrix B'); _b._setData(B);
var _c = new Array2DTracer('Matrix C'); _c._setData(C);

var logger = new LogTracer();

var _r = new Array1DTracer('Random Vector'); 
var _p = new Array1DTracer('Result Vector'); 
