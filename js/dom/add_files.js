'use strict';

const Server = require('../server');

const {
  each
} = $;

const addFileToDOM = (category, algorithm, file, explanation) => {
  var $file = $('<button>')
    .append(file)
    .attr('data-file', file)
    .click(function () {
      Server.loadFile(category, algorithm, file, explanation);
      $('.files_bar > .wrapper > button').removeClass('active');
      $(this).addClass('active');
    });
  $('.files_bar > .wrapper').append($file);
  return $file;
};

module.exports = (category, algorithm, files, requestedFile) => {
  $('.files_bar > .wrapper').empty();

  each(files, (file, explanation) => {
    var $file = addFileToDOM(category, algorithm, file, explanation);
    if (requestedFile && requestedFile == file) $file.click();
  });

  if (!requestedFile) $('.files_bar > .wrapper > button').first().click();
  $('.files_bar > .wrapper').scroll();
};