'use strict';

const app = require('../app');

const {
  isScratchPaper
} = require('../utils');

const showDescription = require('./show_description');
const addFiles = require('./add_files');

module.exports = (category, algorithm, data, requestedFile) => {
  let $menu;
  let category_name;
  let algorithm_name;

  if (isScratchPaper(category)) {
    $menu = $('#scratch-paper');
    category_name = 'Scratch Paper';
    algorithm_name = algorithm ? 'Shared' : 'Temporary';
  } else {
    $menu = $(`[data-category="${category}"][data-algorithm="${algorithm}"]`);
    const categoryObj = app.getCategory(category);
    category_name = categoryObj.name;
    algorithm_name = categoryObj.list[algorithm];
  }

  $('.sidemenu button').removeClass('active');
  $menu.addClass('active');

  $('#category').html(category_name);
  $('#algorithm').html(algorithm_name);
  $('#tab_desc > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  app.setLastFileUsed(null);
  app.getEditor().clearContent();

  const {
    files
  } = data;

  delete data.files;

  showDescription(data);
  addFiles(category, algorithm, files, requestedFile);
};