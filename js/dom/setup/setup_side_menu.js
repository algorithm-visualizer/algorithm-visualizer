'use strict';

const app = require('../../app');

let sidemenu_percent;

module.exports = () => {
  $('#navigation').click(() => {
    const $sidemenu = $('.sidemenu');
    const $workspace = $('.workspace');

    $sidemenu.toggleClass('active');
    $('.nav-dropdown').toggleClass('fa-caret-down fa-caret-up');

    if ($sidemenu.hasClass('active')) {
      $sidemenu.css('right', (100 - sidemenu_percent) + '%');
      $workspace.css('left', sidemenu_percent + '%');

    } else {
      sidemenu_percent = $workspace.position().left / $('body').width() * 100;
      $sidemenu.css('right', 0);
      $workspace.css('left', 0);
    }

    app.getTracerManager().resize();
  });
}
