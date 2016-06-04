'use strict';

module.exports = () => {
  $('#powered-by').click(function() {
    $('#powered-by-list button').toggleClass('collapse');
  });
};
