const app = require('../../app');

module.exports = function() {
  $(window).resize(function() {
    app.getTracerManager().resize();
  });
};