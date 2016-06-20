'use strict';

const get = require('./ajax/get');

module.exports = (wiki) => {
  return get(`./wiki/${wiki}.md`);
};