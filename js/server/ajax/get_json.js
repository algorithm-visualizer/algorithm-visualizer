'use strict';

const request = require('./request');

module.exports = function(url) {
  return request(url, {
    dataType: 'json',
    type: 'GET'
  });
};