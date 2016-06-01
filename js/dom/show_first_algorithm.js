'use strict';

// click the first algorithm in the first category
module.exports = () => {
  $('#list button.category').first().click();
  $('#list button.category + .indent').first().click();
};