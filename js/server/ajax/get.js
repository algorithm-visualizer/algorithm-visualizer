'use strict';

const request = require('./request');

module.exports = (url) => {

  return request(url, {
    type: 'GET'
  });
};