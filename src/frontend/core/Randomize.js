const integer = (min = 1, max = 9) => {
  return (Math.random() * (max - min + 1) | 0) + min;
};

const string = length => {
  const choices = 'abcdefghijklmnopqrstuvwxyz';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += choices[integer(0, choices.length - 1)];
  }
  return text;
};

const array1D = (N, options) => {
  return array2D(1, N, options)[0];
};

const array2D = (N = 10, M = 10, options = {}) => {
  const { sorted = false, min, max } = options;
  const D = [];
  for (let i = 0; i < N; i++) {
    D.push([]);
    for (let j = 0; j < M; j++) {
      D[i].push(integer(min, max));
    }
    if (sorted) D[i].sort((a, b) => a - b);
  }
  return D;
};

const graph = (N = 5, options = {}) => {
  const { directed = true, weighted = false, ratio = .3, min, max } = options;
  const G = new Array(N);
  for (let i = 0; i < N; i++) G[i] = new Array(N);
  for (let i = 0; i < N; i++) {
    G[i][i] = 0;
    if (directed) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        G[i][j] = Math.random() < ratio ? weighted ? integer(min, max) : 1 : 0;
      }
    } else {
      for (let j = 0; j < i; j++) {
        G[i][j] = G[j][i] = Math.random() < ratio ? weighted ? integer(min, max) : 1 : 0;
      }
    }
  }
  return G;
};

export default {
  integer,
  string,
  array1D,
  array2D,
  graph,
};