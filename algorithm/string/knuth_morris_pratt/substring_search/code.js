//Fix JS Negative number modulo Bug
Number.prototype.mod = function (n) {
    return ((this%n)+n)%n;
};

function tracker (substring) {
	var i = 1, j = 0;

	logger._print ('Initializing i to 1, j to 0.');
	substrTracer._select (j);
	while (i < track.length) {
		substrTracer._select (i)._wait ();

		while ( (substring [i] !== substring [j]) && (j > 0) ) {
			logger._print ('j = ' + track [j-1]);
			trackTracer._select (j-1)._wait ();
			trackTracer._deselect (j-1)._wait ();

			substrTracer._deselect (j);
			j = track [j-1];
			logger._print ('j = ' + j);
			substrTracer._select (j);
		}

		if (substring [i] === substring [j]) {
			substrTracer._deselect (j);
			track [i] = ++j;
			trackTracer._notify (i, track [i])._wait ();
			trackTracer._denotify (i)._wait ();
			logger._print ('substring [ ' + i + ' ] (' + substring [i] + ') equals substring [ ' + j + ' ] (' + substring [j] + '), track [ ' + i + ' ] updated to: ' + track [i]);

			logger._print ('j = ' + j);
			substrTracer._select (j);
		}
		else {
			track [i] = 0;
			logger._print ('substring [ ' + i + ' ] (' + substring [i] + ') is not equal to substring [ ' + j + ' ] (' + substring [j] + '), setting track [' + i + '] to 0');
			trackTracer._select (i)._wait ();
			trackTracer._deselect (i)._wait ();
		}

		substrTracer._deselect (i)._wait ();
		i++;
		logger._print ('i = ' + i);
	}

	return track;
}

function kmp (string, substr) {
	var positions = [], j = 0, startPos;

	logger._print ('Constructing Tracker for substring <b>' + substr + '</b>');
	track = tracker (substr);
	logger._print ('Tracker for substring constructed: [ ' + String (track) + ' ]');
	logger._print ('--------------------------------------------------------------------------');
	logger._print ('Running KMP...');

	logger._print ('Initializing i = 0, j = 0');
	for (var i = 0; i < string.length; i++) {
		logger._print ('comparing string [' + i + '] (' + string [i] + ') and substring [' + j + '] (' + substr [j] + ')...');
		stringTracer._select (i)._wait ();
		stringTracer._select (j)._wait ();

		if (string [i] === substr [j]) {
			logger._print ('they\'re equal!');

			if (j === substr.length-1) {
				logger._print ('j (' + j + ') equals length of substring - 1 (' + substr.length + '-1), we\'ve found a new match in the string!');
				startPos = i - substr.length + 1;
				positions.push (startPos);

				logger._print ('Adding start position of the substring (' + startPos + ') to the results.');
				stringTracer._select (startPos)._wait ();
			}
			else {
				stringTracer._deselect (j)._wait ();
				logger._print ('But j (' + j + ') does not equal length of substring (' + substr.length + ') Incrementing j and moving forward.');
				j++;
				logger._print ('j = ' + j);
				stringTracer._select (j)._wait ();
			}
		}
		else {
			var tempJ = j - 1;
			logger._print ('they\'re NOT equal');
			trackTracer._select (tempJ)._wait ();
			stringTracer._deselect (j)._wait ();

			j = track [(j-1).mod (substr.length)];	//use modulo to wrap around, i.e., if index = -1, access the LAST element of array (PYTHON-LIKE)

			logger._print ('Setting j to ' + j);
			stringTracer._select (j)._wait ();
			trackTracer._deselect (tempJ)._wait ();
		}

		stringTracer._deselect (i)._wait ();
	}

	return positions;
}

var positions = kmp (string, substring);

logger._print ('Substring positions are: ' + (positions.length ? String (positions) : 'NONE'));
for (var i = 0; i < positions.length; i++) {
	stringTracer._select (positions [i], positions [i] + substring.length - 1)._wait ();
}
