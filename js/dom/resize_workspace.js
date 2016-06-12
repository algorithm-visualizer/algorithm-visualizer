'use strict';

const app = require('../app');

module.exports = () => {
  app.getTracerManager().resize();
  app.getEditor().resize();
  $('.files_bar > .wrapper').scroll();
};
