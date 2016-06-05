'use strict';

const Server = require('../server');
const converter = new showdown.Converter({tables: true});

module.exports = (wiki) => {
  Server.loadWiki(wiki).then((data) => {
    console.log(data);
    $('#tab_doc > .wrapper').html(converter.makeHtml(data));
  });
};