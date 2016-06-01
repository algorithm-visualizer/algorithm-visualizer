const Array2D = require('./array2d');

const random = (N, min, max) => {
  return Array2D.random(1, N, min, max)[0];
};

const randomSorted = (N, min, max)=> {
  return Array2D.randomSorted(1, N, min, max)[0];
};

module.exports = {
  random,
  randomSorted
};
