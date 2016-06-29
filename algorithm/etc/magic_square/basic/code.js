var i = Math.floor (n/2);
var j = n-1;

for ( var num = 1; num <= n*n; ) {
	logTracer._print ( 'i = ' + i );
	logTracer._print ( 'j = ' + j );

	if( i == -1 && j == n ) {
		j = n - 2;
		i = 0;

		logTracer._print ( 'Changing : ' );
		logTracer._print ( 'i = ' + i );
		logTracer._print ( 'j = ' + j );
	} else {
		if ( j == n ) {
			j = 0;
			logTracer._print ( 'Changing : ' + 'j = ' + j);
		}
		if ( i < 0 ) {
			i = n-1;
			logTracer._print ( 'Changing : ' + 'i = ' + i );
		}
	}

	if ( A[i][j] > 0 ) {
		logTracer._print ( ' Cell already filled : Changing ' + ' i = ' + i + ' j = ' + j );
		j -= 2;
		i++;
		continue;
	} else {
		A[i][j] = num++;
		tracer._notify( i, j, A[i][j] )._wait ();
		tracer._denotify ( i, j );
		tracer._select ( i, j )._wait ();
	}
	j++;
	i--;
}

logTracer._print ( 'Magic Constant is ' + n*(n*n+1)/2 );