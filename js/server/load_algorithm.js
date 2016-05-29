'use strict';

const Utils = require('../utils');
const getJSON = require('./ajax/get_json');

module.exports = (category, algorithm) => {
  const dir = Utils.getAlgorithmDir(category, algorithm);
  return getJSON(`${dir}desc.json`);
};