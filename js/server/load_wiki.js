'use strict';

const get = require('./ajax/get');

module.exports = (wiki) => {
  return get(`./AlgorithmVisualizer.wiki/${wiki}.md`);
};