'use strict';

const app = require('../../app');
const Server = require('../../server');
const showAlgorithm = require('../show_algorithm');
const resizeWorkspace = require('../resize_workspace');

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

    resizeWorkspace();
  });

  $('#documentation').click(function () {
    $('#btn_doc').click();
  });

  $('#powered-by').click(function () {
    $(this).toggleClass('open')
    $('#powered-by-list').toggle(300);
  });

  $('#scratch-paper').click(() => {
    const category = 'scratch';
    const algorithm = app.getLoadedScratch();
    Server.loadAlgorithm(category, algorithm).then((data) => {
      showAlgorithm(category, algorithm, data);
    });
  });
};
