'use strict';

const app = require('../app');
const Server = require('../server');
const converter = new showdown.Converter({tables: true});

module.exports = (wiki) => {
  Server.loadWiki(wiki).then((data) => {
    console.log(data);
    $('#tab_doc > .wrapper').html(converter.makeHtml(data));
    $('#tab_doc > .wrapper a').click(function (e) {
      const href = $(this).attr('href');

      console.log(href);
      if (app.hasWiki(href)) {
        e.preventDefault();
        module.exports(href);
      }
    });
  });
};