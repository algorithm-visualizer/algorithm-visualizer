'use strict';

const {
  extend
} = $;

const cache = {
  lastFileUsed: '',
  files: {}
};

const assertFileName = (name) => {
  if (!name) {
    throw 'Missing file name';
  }
};


/**
 * Global application cache
 */
module.exports = {

  getCachedFile(name) {
    assertFileName(name);
    return cache.files[name];
  },

  updateCachedFile(name, updates) {
    assertFileName(name);
    if (!cache.files[name]) {
      cache.files[name] = {};
    }
    extend(cache.files[name], updates);
  },

  getLastFileUsed() {
    return cache.lastFileUsed;
  },

  setLastFileUsed(file) {
    cache.lastFileUsed = file;
  }
};