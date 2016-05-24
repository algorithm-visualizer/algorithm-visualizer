tracer._pace(500);

// Initialize LIS values for all indexes 
for( var i = 0; i < 20; i++) {
	LIS[i] = 1;
}

tracer._print( 'Calculating Longest Increasing Subsequence values in bottom up manner ');
// Compute optimized LIS values in bottom up manner
for( var i = 1; i < A.length; i++) {
	tracer._select(i) ;
	tracer._print( ' LIS['+i+'] = ' + LIS[i]);
	for( var j =0; j < i; j++) {
		tracer._notify(j);
		if( A[i] > A[j] && LIS[i] < LIS[j] + 1) {
			LIS[i] = LIS[j] + 1;
			tracer._print( ' LIS['+i+'] = ' + LIS[i]);
		}
	}
	tracer._deselect(i);
}

// Pick maximum of all LIS values
tracer._print( 'Now calculate maximum of all LIS values ');
var max = LIS[0];
for( var i = 1; i < A.length; i++) {
	if(max < LIS[i]) {
		max = LIS[i];
	}
}
tracer._print('Longest Increasing Subsequence = max of all LIS = ' + max);
