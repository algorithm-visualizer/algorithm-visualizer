'use strict';

const getJSON = require('./ajax/get_json');

module.exports = () => {
  return getJSON('./wiki.json');
};