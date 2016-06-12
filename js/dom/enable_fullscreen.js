'use strict';

module.exports = () => {
	let $func = 'requestFullScreen',
		vendorPrefixes = ['webkit', 'moz', 'ms', 'o'],
		db = document.body;

	for (let p of vendorPrefixes) {
		let fName = p + $func [0].toUpperCase () + $func.slice (1);
		if (db [fName]) {
			$func = fName;
			break;
		}
	}

	$('#btn_fullscreen').click (function () {
		console.log ('callinggggg', $func);
		db [$func] ();
	});
};
