## Build System

Our project uses [gulp](http://gulpjs.com/) to:

- combine all individual modules into a single file
- transpile ES6 code to ES5 with [babel.js](http://babeljs.io/)
- minimize JS and CSS code
- generate source maps
- add vendor prefixer to the css
- provide a server with live-reload

## Installation

```bash
# install gulp globally so you can run it from the command line
npm install -g gulp-cli

# install all dependencies
npm install

# run gulp to start the livereload server on http://localhost:8080 
gulp
```

**NOTE**: For Node.js versions below 0.12, you need to install an ES6-style Promise Polyfill (in case you receive a "Promise is undefined" error). To run with Promise, use:

```bash
npm install es6-promise
```

Then add the following line at the top of your *gulpfile.babel.js*:

```javascript
var Promise = require ('es6-promise').Promise;
```
Check out [stackoverflow](http://stackoverflow.com/questions/32490328/gulp-autoprefixer-throwing-referenceerror-promise-is-not-defined) for more details on this issue.

To check your Node.js version, use:

```bash
node --version
```

## Code Structure

*Note:* Although no linter is added as of yet, the code closely follows the conventions from [Airbnb's ECMAScript 6 Javascript style guide](https://github.com/airbnb/javascript)

### [js/index.js](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js)

The app entry point is [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js). 
It performs the initial application setup (loads the app when jQuery loads, loads the initial data from the server etc.)

### [js/app/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/app)

The main application object is [`js/app/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/index.js), which holds the necessary global application state flags and application level methods.
It is [extended once the app loads in `index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js#L39) with  the contents of [`app/constructor`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/constructor.js) and [`app/cache`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/cache.js).
This means that from here on now, any file that does `require(/* path to js/app */)` is getting that populated object since calls to `require` are cached.

### [js/dom/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/dom)

The `js/dom` directory holds all the code interacting with the DOM (go figure 😜). 
The code is split into:

- "static" methods that are used everywhere (such as adding algorithm info to the DOM) and,
- setup code which is called within the `app/constructor`, after the DOM is ready, to initialize all the elements with their contents and listeners.

### [js/editor/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/editor)

The `js/editor` directory holds the code to create and execute code in the ace editor.

### [js/module/\*/\*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/module)

The `js/module` directory holds all the tracers and the random-data-creators. 
All the modules are exported together and then "required" inside the entry point [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js) where they are [attached to the global `window` object](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js#L42) so [`eval` can use them](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/editor/executor.js#L12) when executing code in the code editor.

### [js/server/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server)

The `js/server` directory holds all the code to load data from the server and utilizes promises from [RSVP.js](https://github.com/tildeio/rsvp.js/). 
In [`js/server/ajax`](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server/ajax) are some helper methods to make requesting from the server a little easier. 
The main method is [`js/server/ajax/request.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/server/ajax/request.js) that is used by all other methods to call `$.ajax` with certain options and set/reset the global `isLoading` flag for every request.

### [js/trace_manager/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server/ajax)

The `js/tracer_manager` directory holds the manager of tracers, which controls all the present tracers simultaneously.

### [js/utils/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/utils)

The `utils` directory holds a few helper methods that are used everywhere such as building the strings for algorithm and file directories.
