var T = {};

var elements = [5,8,10,3,1,6,9,7,2,0,4]; // item to be searched
var tracer = new DirectedGraphConstructTracer( " BST - Elements marked red indicates the current status of tree ", 0);
var tracer2 = new Array1DTracer ( " Elements ")._setData ( elements );
var logger = new LogTracer ( " Log ");
tracer.attach ( logger );