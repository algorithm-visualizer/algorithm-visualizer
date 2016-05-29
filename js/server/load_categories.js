'use strict';

const appInstance = require('../app');
const getJSON = require('./ajax/get_json');

module.exports = () => {
  return getJSON('./algorithm/category.json');
};