word += '$';	//special character
logger._print ('Appended \'$\' at the end of word as terminating (special) character. Beginning filling of suffixes');

function selectSuffix (word, i) {
	var c = i;

	while (i < word.length-1) {
		wordTracer._select (i);
		i++;
	}
	wordTracer._wait ();

	while (c < word.length-1) {
		wordTracer._deselect (c);
		c++;
	}
	wordTracer._wait ();
}

(function createSA (sa, word) {
	for (var i = 0; i < word.length; i++) {
		sa [i] [1] = word.slice (i);

		selectSuffix (word, i);
		saTracer._notify (i, 1, sa [i] [1])._wait ();
		saTracer._denotify (i, 1)._wait ();
	}
}) (suffixArray, word);

logger._print ('Re-organizing Suffix Array in sorted order of suffixes using efficient sorting algorithm (O(N.log(N)))');
suffixArray.sort (function (a, b) {
	logger._print ('The condition a [1] (' + a [1] + ') > b [1] (' + b [1] + ') is ' + (a [1] > b [1]));
	return a [1] > b [1];
});

for (var i = 0; i < word.length; i++) {
	saTracer._notify (i, 0, suffixArray [i] [0]);
	saTracer._notify (i, 1, suffixArray [i] [1])._wait ();

	saTracer._denotify (i, 0);
	saTracer._denotify (i, 1);
}