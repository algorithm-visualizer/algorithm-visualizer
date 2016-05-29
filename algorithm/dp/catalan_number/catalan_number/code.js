A[0] = 1;
tracer._notify ( 0, A[0] )._wait();
tracer._denotify ( 0 );
A[1] = 1;
tracer._notify ( 1, A[1] )._wait();
tracer._denotify ( 1 );

for (var i = 2; i <= N; i++) {
	for (var j = 0; j < i; j++) {
		A[i] += A[j] * A[i-j-1];
		tracer._select( j )._wait();
		tracer._select( i - j -1 )._wait();
		tracer._notify( i, A[i])._wait();
		tracer._deselect( j );
		tracer._deselect( i - j - 1 );
		tracer._denotify( i );
	}
}

logger._print ( ' The ' + N + 'th Catalan Number is ' + A[N] );
tracer._select( N )._wait();