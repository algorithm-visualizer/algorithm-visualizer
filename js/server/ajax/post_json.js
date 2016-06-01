'use strict';

const request = require('./request');

module.exports = function(url, data) {
  return request(url, {
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(data),
  });
};