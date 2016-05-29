'use strict';

const Editor = require('../editor');
const TracerManager = require('../tracer_manager');
const DOM = require('../dom/setup');
const {
  getFileDir
} = require('../utils');

const Cache = require('./cache');

const {
  each
} = $;

const state = {
  isLoading: null,
  editor: null,
  tracerManager: null,
  categories: null
};

const initState = (tracerManager) => {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
};

/**
 * Global application singleton.
 */
const App = function() {

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

  const tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);

};

App.prototype = Cache;

module.exports = App;