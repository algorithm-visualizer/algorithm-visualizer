'use strict';

const app = require('../app');
const Server = require('../server');
const showAlgorithm = require('./show_algorithm');

const {
  each
} = $;

const getAlgorithmDOM = (category, subList, algorithm) => {
  return $('<button class="indent">')
    .append(subList[algorithm])
    .attr('data-algorithm', algorithm)
    .attr('data-category', category)
    .click(function () {
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
  } = app.getCategory(category);

  const $category = $('<button class="category">')
    .append('<i class="fa fa-fw fa-caret-right">')
    .append(categoryName)
    .attr('data-category', category);

  $category.click(function () {
    const $self = $(this);
    $self.toggleClass('open');
    $self.next().toggleClass('collapse');
    $self.find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  const $algorithms = $('<div class="algorithms collapse">');
  $('#list').append($category).append($algorithms);

  each(categorySubList, (algorithm) => {
    const $algorithm = getAlgorithmDOM(category, categorySubList, algorithm);
    $algorithms.append($algorithm);
  });
};

module.exports = () => {
  each(app.getCategories(), addCategoryToDOM);
};
