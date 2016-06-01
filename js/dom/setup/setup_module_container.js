const app = require('../../app');

module.exports = () => {

  const $module_container = $('.module_container');

  $module_container.on('mousedown', '.module_wrapper', function(e) {
    app.getTracerManager().findOwner(this).mousedown(e);
  });

  $module_container.on('mousemove', '.module_wrapper', function(e) {
    app.getTracerManager().findOwner(this).mousemove(e);
  });

  $module_container.on('DOMMouseScroll mousewheel', '.module_wrapper', function(e) {
    app.getTracerManager().findOwner(this).mousewheel(e);
  });
}