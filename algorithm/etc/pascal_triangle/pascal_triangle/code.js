for ( var i = 0; i < N; i++ ) {
	for ( var j = 0; j <= i; j++ ) {
		if( j === i || j === 0 ) { // First and last values in every row are 1
			A[i][j] = 1;

			tracer._notify( i, j, A[i][j])._wait();
			tracer._denotify( i, j);
		} else { // Other values are sum of values just above and left of above
			tracer._select( i-1, j-1)._wait();
			tracer._select( i-1, j)._wait();

			A[i][j] = A[i-1][j-1] + A[i-1][j];
			
			tracer._notify( i, j, A[i][j])._wait();
			tracer._denotify( i, j);
			tracer._deselect( i-1, j-1);
			tracer._deselect( i-1, j);
		}
	}
}