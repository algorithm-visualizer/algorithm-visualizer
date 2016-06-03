function bst ( item, node, parent ) { // node = current node , parent = previous node
	tracer._visit ( node, parent )._wait ();
	if ( item === node ) { 			// key found 
		tracer2._select ( 0 )._wait();
		logger._print ( ' Match Found ' );
	} else if ( item < node ) { 	// key less than value of current node
		if( T[node][0] === -1 ) {
			tracer2._notify ( 0, item )._wait();
			logger._print ( ' Not Found ');
		} else {
			tracer2._notify ( 0, item )._wait();
			bst ( item, T[node][0], node );
			tracer2._denotify ( 0 );
		}
	} else {						// key greater than value of current node 
		if ( T[node][1] === -1 ) {
			tracer2._notify ( 0, item )._wait();
			logger._print ( ' Not Found ');
		} else {
			tracer2._notify ( 0, item )._wait();
			bst ( item, T[node][1], node );
			tracer2._denotify ( 0 );
		}
	}
}

bst ( key[0], 5 ); // node with key 5 is the root