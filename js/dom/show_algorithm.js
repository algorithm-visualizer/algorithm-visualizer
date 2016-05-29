'use strict';

const appInstance = require('../app');
const {
  isScratchPaper
} = require('../utils');

const showDescription = require('./show_description');
const showFiles = require('./show_files');


module.exports = (category, algorithm, data) => {
  let $menu;
  let category_name;
  let algorithm_name;

  if (isScratchPaper(category, algorithm)) {
    $menu = $('#scratch-paper');
    category_name = '';
    algorithm_name = 'Scratch Paper';
  } else {
    $menu = $(`[data-category="${category}"][data-algorithm="${algorithm}"]`);
    const categoryObj = appInstance.getCategory(category);
    category_name = categoryObj.name;
    algorithm_name = categoryObj.list[algorithm];
  }

  $('.sidemenu button').removeClass('active');
  $menu.addClass('active');
  $('#btn_desc').click();

  $('#category').html(category_name);
  $('#algorithm').html(algorithm_name);
  $('#tab_desc > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  appInstance.setLastFileUsed(null);
  appInstance.getEditor().clearContent();

  const {
    files
  } = data;

  delete data.files;

  showDescription(data);
  showFiles(category, algorithm, files);
};