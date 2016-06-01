'use strict';

const TracerManager = require('./manager');
const Tracer = require('../module/tracer');

module.exports = {

  init() {
    const tm = new TracerManager();
    Tracer.prototype.manager = tm;
    return tm;
  }

};