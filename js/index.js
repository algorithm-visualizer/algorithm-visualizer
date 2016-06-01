'use strict';

const RSVP = require('rsvp');
const appInstance = require('./app');
const AppConstructor = require('./app/constructor');
const DOM = require('./dom');
const Server = require('./server');

const modules = require('./module');

const {
  extend
} = $;

$.ajaxSetup({
  cache: false,
  dataType: 'text'
});

const {
  isScratchPaper
} = require('./utils');

const {
  getPath
} = require('./server/helpers');

// set global promise error handler
RSVP.on('error', function (reason) {
  console.assert(false, reason);
});

$(() => {

  // initialize the application and attach in to the instance module
  const app = new AppConstructor();
  extend(true, appInstance, app);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);

  Server.loadCategories().then((data) => {
    appInstance.setCategories(data);
    DOM.addCategories();

    // determine if the app is loading a pre-existing scratch-pad
    // or the home page
    const {
      category,
      algorithm,
      file
    } = getPath();
    if (isScratchPaper(category)) {
      if (algorithm) {
        Server.loadScratchPaper(algorithm).then(({category, algorithm, data}) => {
          DOM.showAlgorithm(category, algorithm, data);
        });
      } else {
        Server.loadAlgorithm(category).then((data) => {
          DOM.showAlgorithm(category, null, data);
        });
      }
    } else if (category && algorithm) {
      DOM.showRequestedAlgorithm(category, algorithm, file);
    } else {
      DOM.showFirstAlgorithm();
    }

  });
});