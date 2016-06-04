var index = 0;

function inorder ( root , parent ) {
	if (root === -1) {
		logger._print( 'No more nodes. Backtracking.' )._wait ();
		return;
	}

	logger._print( 'Reached ' + root);
	treeTracer._visit ( root , parent )._wait ();

	logger._print ( ' Going left from ' + root )._wait ();
	inorder(T[root][0], root);

	logger._print ( ' Going right from ' + root )._wait ();
	inorder(T[root][1], root);

	logger._print( 'Printing ' + root);
	treeTracer._leave ( root );
	arrayTracer._notify ( index++, root )._wait();
}

inorder ( 5 ); // node with key 5 is the root
logger._print( 'Finished' );
