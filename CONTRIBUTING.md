# Contributing to Algorithm Visualizer

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

# run gulp to build all the files start the livereload server on http://localhost:8080
gulp
```

## Adding changes

To add changes and improvements or resolve issues, these are the usual steps:

- Fork the project on Github then clone it to your machine:
```bash
git clone https://github.com/<your-username>/AlgorithmVisualizer
```
- Your fork's remote repository should be named `origin` by default, so add the main repository as a remote as well and give it a name to distinguish it from your fork (something like `main` would work):
```bash
git remote add main https://github.com/parkjs814/AlgorithmVisualizer
```

- Create a branch addressing the issue/improvement you'd like to tackle.

```bash
git checkout -b my-problem-fixer-branch
```

- Make your changes and push to your repo
```bash
# write some awesome code and then ...
git add .
git commit -m "Explain my awesome changes"
git push origin my-problem-fixer-branch
```

- Next you create a pull request from `my-problem-fixer-branch` on `origin`to `gh-pages` on `main`.

- Once approved, just delete `my-problem-fixer-branch` both locally and remotely because it's not needed anymore.

- Finally, checkout `gh-pages` locally, pull the approved changes from the `main` repo and push them to your `origin` repo:
```bash
git checkout gh-pages  # checkout gh pages locally
git pull main gh-pages # pull new changes from main repository
git push main gh-pages # push the changes to your fork
```

## Project Structure

*Note:* Although no linter is added as of yet, the code closely follows the conventions from [Airbnb's Javascript style guide](https://github.com/airbnb/javascript)

### [js/index.js](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/index.js)

The app entry point is [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/index.js).
It performs the initial application setup (loads the app when jQuery loads, loads the initial data from the server etc.)

### [js/app/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/app)

The main application object is [`js/app/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/app/index.js), which holds the necessary global application state flags and application level methods.
It is [extended once the app loads in `index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/index.js#L30) with  the contents of [`app/constructor`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/app/constructor.js) and [`app/cache`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/app/cache.js).
This means that from here on now, any file that does `require(/* path to js/app */)` is getting that populated object since calls to `require` are cached.

### [js/dom/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/dom)

The `js/dom` folder holds all the code interacting with the DOM (go figure 😜).
The code is split into:

- "static" methods that are used everywhere (such as adding algorithm info to the DOM) and,
- setup code which is called within the `app/constructor`, after the DOM is ready, to initialize all the elements with their contents and listeners.

### [js/editor/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/editor)

The `js/editor` folder holds the code to create and execute code in the ace editor.

### [js/module/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/module)

The `js/module` folder holds all the tracers and their variations and it is essentially the same as [`js/module`](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/module) on the `gh-pages` branch.
The only changes are present in `js/tracer.js` where the code is converted to ES6.
All the modules are exported together and then "required" inside the entry point [`js/index.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/index.js) where they are [attached to the global `window` object](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/index.js#L33) so [`eval` can use them](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/editor/executor.js#L7) when executing code in the code editor.

### [js/server/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/server)

The `js/server` folder holds all the code to load data from the server and utilizes promises from [RSVP.js](https://github.com/tildeio/rsvp.js/).
In [`js/server/ajax`](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/server/ajax) are some helper methods to make requesting from the server a little easier.
The main method is [`js/server/ajax/request.js`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/server/ajax/request.js) that is used by all other methods to call `$.ajax` with certain options and set/reset the global `isLoading` flag for every request.

### [js/trace_manager/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/server/ajax)

The `js/tracer_manager` folder holds the same logic as the [original `tracer_manager`](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/js/tracer_manager.js) from `gh-pages` branch converted to ES6 and split into modules based on functionality.

### [js/utils/*.js](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/js/utils)

The `utils` folder holds a few helper methods that are used everywhere such as building the strings for algorithm and file directories.
