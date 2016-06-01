'use strict';

const getJSON = require('./ajax/get_json');

const {
  getAlgorithmDir
} = require('../utils');

module.exports = (category, algorithm) => {
  const dir = getAlgorithmDir(category, algorithm);
  return getJSON(`${dir}desc.json`);
};