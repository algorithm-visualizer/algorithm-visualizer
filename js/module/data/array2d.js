'use strict';

const Integer = require('./integer');

const random = (N, M, min, max) => {
  if (!N) N = 10;
  if (!M) M = 10;
  if (min === undefined) min = 1;
  if (max === undefined) max = 9;
  var D = [];
  for (var i = 0; i < N; i++) {
    D.push([]);
    for (var j = 0; j < M; j++) {
      D[i].push(Integer.random(min, max));
    }
  }
  return D;
};

const randomSorted = (N, M, min, max) => {
  return random(N, M, min, max).map(function (arr) {
    return arr.sort(function (a, b) {
      return a - b;
    });
  });
};

module.exports = {
  random,
  randomSorted
};
