var i,j;

// Fill memo table in bottom up manner 
for ( i = 0; i <= m; i++ ) {
	for ( j = 0; j <= n; j++ ) {
		if( i === 0 ) {
			A[i][j] = j;
		} else if ( j === 0 ) {
			A[i][j] = i;
		} else if ( string1[i-1] == string2[j-1] ) {
			tracer1._select ( i-1 )._wait ();
 			tracer2._select ( j-1 )._wait ();
 			tracer3._select ( i-1, j-1 )._wait ();

			A[i][j] = A[i-1][j-1] + 1;

			tracer1._deselect ( i-1 );
 			tracer2._deselect ( j-1 );
 			tracer3._deselect ( i-1, j-1 );
		} else {
			tracer3._select ( i-1, j )._wait ();
 			tracer3._select ( i, j-1 )._wait ();

			if ( A[i-1][j] < A[i][j-1] ) {
				A[i][j] = 1 + A[i-1][j];
			} else {
				A[i][j] = 1 + A[i][j-1];
			}

			tracer3._deselect ( i-1, j );
 			tracer3._deselect ( i, j-1 );
		}
		tracer3._notify ( i, j , A[i][j] )._wait ();
 		tracer3._denotify( i, j );
	}
}

 logger._print ( 'Shortest Common Supersequence is ' + A[m][n] );
