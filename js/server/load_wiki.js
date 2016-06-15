'use strict';

const get = require('./ajax/get');

module.exports = (wiki) => {
  return get(`http://parkjs814.github.io/AlgorithmVisualizer/AlgorithmVisualizer.wiki/${wiki}.md`);
};