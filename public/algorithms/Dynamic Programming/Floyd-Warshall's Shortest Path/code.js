// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new GraphTracer().weighted();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
const G = Randomize.Graph({ N: 5, ratio: 1, weighted: true });
tracer.set(G);
Tracer.delay();
// }

function FloydWarshall() {
  // Finds the shortest path between all nodes
  const S = new Array(G.length);
  for (let i = 0; i < G.length; i++) S[i] = new Array(G.length);
  for (let i = 0; i < G.length; i++) {
    for (let j = 0; j < G.length; j++) {
      // Distance to self is always 0
      if (i === j) S[i][i] = 0;
      // Distance between connected nodes is their weight
      else if (G[i][j] > 0) {
        S[i][j] = G[i][j];
      }// Else we don't know the distance and we set it to infinity
      else S[i][j] = MAX_VALUE;
    }
  }
  // If there is a shorter path using k, use it instead
  for (let k = 0; k < G.length; k++) {
    for (let i = 0; i < G.length; i++) {
      if (k === i) continue;
      // visualize {
      tracer.visit(k, i);
      Tracer.delay();
      // }
      for (let j = 0; j < G.length; j++) {
        if (i === j || j === k) continue;
        // visualize {
        tracer.visit(j, k);
        Tracer.delay();
        // }
        if (S[i][j] > S[i][k] + S[k][j]) {
          // visualize {
          tracer.visit(j, i, S[i][j]);
          Tracer.delay();
          // }
          S[i][j] = S[i][k] + S[k][j];
          // visualize {
          tracer.leave(j, i, S[i][j]);
          // }
        }
        // visualize {
        tracer.leave(j, k);
        // }
      }
      // visualize {
      tracer.leave(k, i);
      Tracer.delay();
      // }
    }
  }
  // logger {
  for (let i = 0; i < G.length; i++) {
    for (let j = 0; j < G.length; j++) {
      if (S[i][j] === MAX_VALUE) logger.println(`there is no path from ${i} to ${j}`);
      else logger.println(`the shortest path from ${i} to ${j} is ${S[i][j]}`);
    }
  }
  // }
}

let MAX_VALUE = Infinity;
// logger {
logger.println('finding the shortest paths from and to all nodes');
// }
FloydWarshall();
