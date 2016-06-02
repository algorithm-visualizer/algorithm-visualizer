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
        const $wrapper = $('<div class="complexity">');
        const $type = $('<span class="complexity-type">').html(`${prop}: `);
        const $value = $('<span class="complexity-value">').html(`${value[prop]}`);

        $wrapper.append($type).append($value);

        $ul.append($('<li>').append($wrapper));
      });
    }
  });
};
