
var tracer = new Array1DTracer('Input Text');
var matrix = new Array2DTracer('Matrix');
var logger = new LogTracer();


var seq = "BBABCBCAB";
var N;
N = seq.length;


var L = new Array(N);

var i,j;
for(i=0;i<N;i++) {
  L[i]= new Array(N);
}
for(i=0;i<N;i++) {
  L[i][i]=1;
}

tracer._setData(seq);
matrix._setData(L);
