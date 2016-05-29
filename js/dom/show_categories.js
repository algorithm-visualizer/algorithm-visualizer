'use strict';

const appInstance = require('../app');
const Server = require('../server');
const showAlgorithm = require('./show_algorithm');

const {
  each
} = $;

const addAlgorithmToCategoryDOM = (category, subList, algorithm) => {
  const $algorithm = $('<button class="indent collapse">')
    .append(subList[algorithm])
    .attr('data-algorithm', algorithm)
    .attr('data-category', category)
    .click(function() {
      Server.loadAlgorithm(category, algorithm).then((data) => {
        showAlgorithm(category, algorithm, data);
      });
    });

  $('#list').append($algorithm);
};

const addCategoryToDOM = (category) => {

  const {
    name: categoryName,
    list: categorySubList
  } = appInstance.getCategory(category);

  const $category = $('<button class="category">')
    .append('<i class="fa fa-fw fa-caret-right">')
    .append(categoryName);

  $category.click(function() {
    $(`[data-category="${category}"]`).toggleClass('collapse');
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  $('#list').append($category);

  each(categorySubList, (algorithm) => {
    addAlgorithmToCategoryDOM(category, categorySubList, algorithm);
  });
};

module.exports = () => {
  each(appInstance.getCategories(), addCategoryToDOM);
};