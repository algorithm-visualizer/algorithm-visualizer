'use strict';

// click the first algorithm in the first category
module.exports = () => {
  $('#list .category').first().click();
  $('#list .category + .algorithms > .indent').first().click();
};
