function knightTour(x, y, moveNum) {
	if (moveNum === N*N) {
		return true;
	}

	for (var i = 0; i < 8; i++) {
		var nextX = x + X[i];
		var nextY = y + Y[i];
		
		posTracer._notify ( 0, nextX)._wait ();
		posTracer._notify ( 1, nextY)._wait ();
		posTracer._denotify (0);
		posTracer._denotify (1);
		/*
		Check if knight is still in the board
		Check that knight does not visit an already visited square
		*/
		if (nextX>=0 && nextX<N && nextY>=0 && nextY<N && board[nextX][nextY]===-1) {
			board[nextX][nextY] = moveNum;
			
			logTracer._print ('Move to ' + nextX + ',' + nextY);
			boardTracer._notify ( nextX, nextY, moveNum)._wait();
			boardTracer._denotify( nextX, nextY);
			boardTracer._select ( nextX, nextY);
			
			var nextMoveNum = moveNum + 1;
			if ( knightTour (nextX,nextY, nextMoveNum) === true) {
				return true;
			} else {
				logTracer._print ('No place to move from ' + nextX + ',' +nextY + ': Backtrack');
				board[nextX][nextY] = -1; // backtrack 
				boardTracer._notify ( nextX, nextY, -1)._wait();
				boardTracer._denotify( nextX, nextY);
				boardTracer._deselect( nextX, nextY);
			}
		} else {
			logTracer._print (nextX + ',' + nextY + ' is not a valid move');
		}
	}
	return false;
}

board[0][0] = 0; // start from this position
pos[0] = 0;
pos[0] = 0;

boardTracer._notify ( 0, 0, 0)._wait();
posTracer._notify ( 0, 0)._wait ();
posTracer._notify ( 1, 0)._wait ();
boardTracer._denotify( 0, 0);
boardTracer._denotify( 0, 0);
posTracer._denotify (0);
posTracer._denotify (1);

if (knightTour ( 0, 0, 1) === false ) {
	logTracer._print ('Solution does not exist');
} else {
	logTracer._print ('Solution found');
}
