process.chdir (__dirname);

var app = require ('express') (),
    serveStatic = require ('serve-static');

app
    .use (serveStatic (__dirname))
    .listen (process.env.NODE_ENV || 8080, function () {
        console.log ('Ready');
    });