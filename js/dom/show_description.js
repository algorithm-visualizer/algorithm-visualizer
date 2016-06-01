'use strict';

const {
  isArray
} = Array;

const {
  each
} = $;

module.exports = (data) => {
  const $container = $('#tab_desc > .wrapper');
  $container.empty();

  each(data, (key, value) => {

    if (key) {
      $container.append($('<h3>').html(key));
    }

    if (typeof value === 'string') {
      $container.append($('<p>').html(value));

    } else if (isArray(value)) {

      const $ul = $('<ul>');
      $container.append($ul);

      value.forEach((li) => {
        $ul.append($('<li>').html(li));
      });

    } else if (typeof value === 'object') {

      const $ul = $('<ul>');
      $container.append($ul);

      each(value, (prop) => {
        $ul.append($('<li>').append($('<strong>').html(prop)).append(` ${value[prop]}`));
      });
    }
  });
};