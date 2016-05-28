var N = text.length;
var M = pattern.length;

var hashText = 0; //hash value for text
var hashPattern = 0; //hash value for pattern
var h = 1;

for ( var i = 0; i <  (M - 1); i++ ) {
	h = ( h * D ) % Q;
}

for ( var i = 0; i < M; i++ ) {
	hashPattern = ( D * hashPattern + pattern[i].charCodeAt(0)) % Q;
	hashText = ( D * hashText + text[i].charCodeAt(0)) % Q;
}

for ( var i = 0 ; i <= N-M; i++ ) {

	/*
	Check if hash values of current window of text matches 
	with hash values of pattern. If match is found then 
	check for characters one by one
	*/
	if ( hashPattern === hashText ) {
		var f = 0;
		tracer1._select( i, i + M )._wait();
		tracer2._select( 0, M - 1 )._wait();
		for( var j = 0; j < M; j++ ) {

			tracer1._notify( i + j )._wait();
			tracer2._notify( j )._wait();
			if ( text[i + j] != pattern[j] ) {
				f++;
			}
			tracer1._denotify( i + j );
			tracer2._denotify( j );
		}

		if( f === 0 ) {
			logger._print( ' Pattern found at index ' + i );
		}
		tracer1._deselect( i, i + M );
		tracer2._deselect( 0, M - 1 );
	}

	/*
	Calculate hash value for next window of text :
	*/
	if ( i < N-M ) {
		hashText = ( D * ( hashText - text[i].charCodeAt(0)*h ) + text[ i + M ].charCodeAt(0) ) % Q;

		// Convert negative value of hashText (if found) to positive
		if ( hashText < 0 ) {
			hashText = hashText + Q;
		}
	}
}