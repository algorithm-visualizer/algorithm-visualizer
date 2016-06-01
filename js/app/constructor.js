'use strict';

const Editor = require('../editor');
const TracerManager = require('../tracer_manager');
const DOM = require('../dom/setup');

const Cache = require('./cache');

const state = {
  isLoading: null,
  editor: null,
  tracerManager: null,
  categories: null,
  loadedScratch: null
};

const initState = (tracerManager) => {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
  state.loadedScratch = null;
};

/**
 * Global application singleton.
 */
const App = function () {

  this.getIsLoading = () => {
    return state.isLoading;
  };

  this.setIsLoading = (loading) => {
    state.isLoading = loading;
    if (loading) {
      $('#loading-slider').removeClass('loaded');
    } else {
      $('#loading-slider').addClass('loaded');
    }
  };

  this.getEditor = () => {
    return state.editor;
  };

  this.getCategories = () => {
    return state.categories;
  };

  this.getCategory = (name) => {
    return state.categories[name];
  };

  this.setCategories = (categories) => {
    state.categories = categories;
  };

  this.updateCategory = (name, updates) => {
    $.extend(state.categories[name], updates);
  };

  this.getTracerManager = () => {
    return state.tracerManager;
  };

  this.getLoadedScratch = () => {
    return state.loadedScratch;
  };

  this.setLoadedScratch = (loadedScratch) => {
    state.loadedScratch = loadedScratch;
  };

  const tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);

};

App.prototype = Cache;

module.exports = App;