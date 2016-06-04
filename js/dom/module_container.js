'use strict';

const create = () => {
  const $container = $('<section class="module_wrapper">');
  $('.module_container').append($container);
  return $container;
};

module.exports = {
  create
};
