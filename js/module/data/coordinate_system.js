const random = (N, min, max) => {
  if (!N) N = 7;
  if (!min) min = 1;
  if (!max) max = 10;
  var C = new Array(N);
  for (var i = 0; i < N; i++) C[i] = new Array(2);
  for (var i = 0; i < N; i++)
    for (var j = 0; j < C[i].length; j++)
      C[i][j] = (Math.random() * (max - min + 1) | 0) + min;
  return C;
};

module.exports = {
  random
};