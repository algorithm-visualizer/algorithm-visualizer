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

    $('.nav-dropdown').toggleClass('fa-caret-down fa-caret-right');
    if ($sidemenu.hasClass('active')) {
        $sidemenu.animate({ "right": (100 - sidemenu_percent) + '%'}, "fast" );
        $workspace.animate({ "left": sidemenu_percent + '%' }, "fast" );
    } else {
        sidemenu_percent = $workspace.position().left / $('body').width() * 100;
        $sidemenu.animate({ "right": "0%" }, "fast" );
        $workspace.animate({ "left": "0%" }, "fast" );
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
