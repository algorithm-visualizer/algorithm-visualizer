# ES6 Project Update

The project is converted to ES6 and the code is added to the [master branch](https://github.com/parkjs814/AlgorithmVisualizer/tree/master). 
It will stay there until it reaches the same level as`gh-pages`, at which point the master branch will become the default branch.

## Build System

The new app uses [gulp](http://gulpjs.com/) to:

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

# run gulp to build all the files start the livereload server on http://localhost:8080
gulp
```

## Changes Summary

*Note:* Although no linter is added as of yet, the code closely follows the conventions from [Airbnb's Javascript style guide](https://github.com/airbnb/javascript)

### [js/index.js](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js)

The app entry point is [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js). 
It performs the initial application setup (loads the app when jQuery loads, loads the initial data from the server etc.)

### [js/app/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/app)

The main application object is [`js/app/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/index.js), which holds the necessary global application state flags and application level methods.
It is [extended once the app loads in `index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js#L30) with  the contents of [`app/constructor`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/constructor.js) and [`app/cache`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/app/cache.js).
This means that from here on now, any file that does `require(/* path to js/app */)` is getting that populated object since calls to `require` are cached.

### [js/dom/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/dom)

The `js/dom` folder holds all the code interacting with the DOM (go figure 😜). 
The code is split into:

- "static" methods that are used everywhere (such as adding algorithm info to the DOM) and,
- setup code which is called within the `app/constructor`, after the DOM is ready, to initialize all the elements with their contents and listeners.

### [js/editor/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/editor)

The `js/editor` folder holds the code to create and execute code in the ace editor.

### [js/module/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/module)

The `js/module` folder holds all the tracers and their variations and it is essentially the same as [`js/module`](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/module) on the `gh-pages` branch. 
The only changes are present in `js/tracer.js` where the code is converted to ES6. 
All the modules are exported together and then "required" inside the entry point [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js) where they are [attached to the global `window` object](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/index.js#L33) so [`eval` can use them](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/editor/executor.js#L7) when executing code in the code editor.

### [js/server/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server)

The `js/server` folder holds all the code to load data from the server and utilizes promises from [RSVP.js](https://github.com/tildeio/rsvp.js/). 
In [`js/server/ajax`](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server/ajax) are some helper methods to make requesting from the server a little easier. 
The main method is [`js/server/ajax/request.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/master/js/server/ajax/request.js) that is used by all other methods to call `$.ajax` with certain options and set/reset the global `isLoading` flag for every request.

### [js/trace_manager/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/server/ajax)

The `js/tracer_manager` folder holds the same logic as the [original `tracer_manager`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/tracer_manager.js) from `gh-pages` branch converted to ES6 and split into modules based on functionality.

### [js/utils/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/master/js/utils)

The `utils` folder holds a few helper methods that are used everywhere such as building the strings for algorithm and file directories.

## Remaining updates

- Any algorithms added since ES6 updates were pushed to master.
- The following pull-request code is still missing from the ES6 project and needs to be added before a full project update can be made:

  - https://github.com/parkjs814/AlgorithmVisualizer/pull/97
  - https://github.com/parkjs814/AlgorithmVisualizer/pull/101
  - https://github.com/parkjs814/AlgorithmVisualizer/pull/102
