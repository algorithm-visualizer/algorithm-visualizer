for ( var i = 1; i < N; i++ ) {
	// next is minimum of m2, m3 and m5
	var next = (M[0] <= M[1])?( M[0] <= M[2] )?M[0]:M[2]:( M[1] <= M[2] )?M[1]:M[2];
	logger._print( ' Minimum of ' + M[0] + ', ' + M[1] + ', ' + M[2] + " : " + next );
	A[i] = next;

	tracer._notify( i, A[i] )._wait();
	tracer._denotify( i );

	if ( next === M[0] ) {
		I[0]++;
		M[0] = A[I[0]] * 2;
		tracer2._notify( 0, M[0])._wait();
		tracer3._notify( 0, I[0])._wait();
		tracer2._denotify(0);
		tracer3._denotify(0);

	}
	if ( next === M[1] ) {
		I[1]++;
		M[1] = A[I[1]] * 3;
		tracer2._notify( 1, M[1])._wait();
		tracer3._notify( 1, I[1])._wait();
		tracer2._denotify(1);
		tracer3._denotify(1);
	}
	if ( next === M[2] ) {
		I[2]++;
		M[2] = A[I[2]] * 5;
		tracer2._notify( 2, M[2])._wait();
		tracer3._notify( 2, I[2])._wait();
		tracer2._denotify(2);
		tracer3._denotify(2);
	}
}
