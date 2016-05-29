const appInstance = require('../../app');

module.exports = function() {
  $(window).resize(function() {
    appInstance.getTracerManager().resize();
  });
};