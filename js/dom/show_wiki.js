'use strict';

const app = require('../app');
const Server = require('../server');
const converter = new showdown.Converter({tables: true});

module.exports = (wiki) => {
  Server.loadWiki(wiki).then((data) => {
    $('#tab_doc > .tab_inner > .wrapper').html(converter.makeHtml(`#${wiki}\n${data}`));
    $('#tab_doc').scrollTop(0);
    $('#tab_doc > .tab_inner > .wrapper a').click(function (e) {
      const href = $(this).attr('href');
      if (app.hasWiki(href)) {
        e.preventDefault();
        module.exports(href);
      }
    });
  });
};