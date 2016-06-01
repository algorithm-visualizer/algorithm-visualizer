'use strict';

var tracers = require('./tracer');
var datas = require('./data');

const {
  extend
} = $;

module.exports = extend(true, {}, tracers, datas);