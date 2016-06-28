var min = A[0];
var max = A[0];

for( var  i = 1; i < N; i++ ) {
	if( A[i] < min ) {
		min = A[i];
	}
	if( A[i] > max ) {
		max = A[i];
	}
}
var range = max - min + 1;

var holes = new Array ( range );
for ( var i = 0; i < range; i++ ) {
	holes[i] = [];
}
tracer2._setData( holes );

logTracer._print ( 'Filling up holes' );
for ( var i = 0; i < N ; i++ ) {
	tracer1._select ( i )._wait ();

	holes[ A[i] - min ].push( A[i] );
	
	tracer2._setData( holes );
	tracer1._deselect ( i );
}

logTracer._print ( 'Building sorted array' );
var k = 0;
for ( var i = 0; i < range ; i++ ) {
	for (var j = 0; j < holes[i].length; j++ ) {
		tracer2._select ( i, j )._wait ();
		A[k++] = holes[i][j];
		tracer1._notify ( k-1, A[k-1] )._wait ();
		tracer2._deselect ( i, j );
		tracer1._denotify ( k-1 );
	}
}

logTracer._print ( 'Sorted array is ' + A );