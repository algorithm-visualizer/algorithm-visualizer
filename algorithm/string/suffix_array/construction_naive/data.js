var word = 'virgo';
var suffixArray = (function skeleton (word) {
	var arr = [];

	for (var i = 1; i <= word.length+1; i++) {
		arr.push ([i, '-']);
	}

	return arr;
}) (word);

var saTracer = new Array2DTracer ('Suffix Array'),
	wordTracer = new Array1DTracer ('Given Word'),
	logger = new LogTracer ('Progress');

saTracer._setData (suffixArray);
wordTracer._setData (word);