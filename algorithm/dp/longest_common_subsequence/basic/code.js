var i,j;

// Build the memo table in bottom up fashion 
 for( i = 0; i <= m; i++ ) {
 	for( j = 0; j <= n; j++ ) {
 		if ( i === 0 || j === 0 ) {
 			A[i][j] = 0;
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
 			
 			if( A[i-1][j] > A[i][j-1] ) {
 				A[i][j] = A[i-1][j];
 			} else {
 				A[i][j] = A[i][j-1];
 			}
 			
 			tracer3._deselect ( i-1, j );
 			tracer3._deselect ( i, j-1 );
 		}
 		tracer3._notify ( i, j , A[i][j] )._wait ();
 		tracer3._denotify( i, j );
 	}
 }

var finalString = '';
i=m;
j=n;
while( i>=1 && j>=1 ) {

	tracer3._select ( i, j )._wait ();
	if( string1[i-1] == string2[j-1] ) {
		tracer1._select ( i-1 )._wait ();
 		tracer2._select ( j-1 )._wait ();
 		
		finalString = string1[i-1] + finalString;
		i--;
		j--;
	} else if( A[i-1][j] > A[i][j-1] ) {
		i--;
	} else {
		j--;
	}
}

logger._print ( 'Longest Common Subsequence Length is ' + A[m][n] );
logger._print ( 'Longest Common Subsequence is ' + finalString );