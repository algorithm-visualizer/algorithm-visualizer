'use strict';

const random = (min, max) => {
  return (Math.random() * (max - min + 1) | 0) + min;
};

module.exports = {
  random
};
