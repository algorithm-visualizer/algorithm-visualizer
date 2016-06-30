'use strict';

const RSVP = require('rsvp');
const app = require('./app');
const AppConstructor = require('./app/constructor');
const DOM = require('./dom');
const Server = require('./server');
const Sandbox= require('./create');
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
  getHashValue,
  getParameterByName,
  getPath
} = require('./server/helpers');

// set global promise error handler
RSVP.on('error', function (reason) {
  console.assert(false, reason);
});

$(() => {

  // initialize the application and attach in to the instance module
  const appConstructor = new AppConstructor();
  extend(true, app, appConstructor);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);
  extend(true, window, Sandbox);

  Server.loadCategories().then((data) => {
    app.setCategories(data);
    DOM.addCategories();

    //enable search feature
    DOM.enableSearch ();
    //enable fullscreen feature
    DOM.enableFullScreen ();

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

    Sandbox.setupButtons();

  });

  Server.loadWikiList().then((data) => {
    app.setWikiList(data.wikis);

    DOM.showWiki('Tracer');
  });

  var v1LoadedScratch = getHashValue('scratch-paper');
  var v2LoadedScratch = getParameterByName('scratch-paper');
  var vLoadedScratch = v1LoadedScratch || v2LoadedScratch;
  if (vLoadedScratch) {
    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + '#path=scratch/' + vLoadedScratch;
  }

});
