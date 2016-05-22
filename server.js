process.chdir (__dirname);

var express = require ('express'),
	serveStatic = require ('serve-static'),
	app = express ();

app
	.use (serveStatic (__dirname))
	.listen (8080, function () {
		console.log ('ready');
	});