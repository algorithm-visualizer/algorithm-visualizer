// import visualization libraries {
const { Tracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new GraphTracer().weighted();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.log(logger);
const G = Randomize.Graph({ N: 5, ratio: .5, value: () => Randomize.Integer({ min: -2, max: 5 }), weighted: true });
tracer.set(G);
Tracer.delay();
// }

function BELLMAN_FORD(src, dest) {
  const weights = new Array(G.length);
  let i;
  let j;

  for (i = 0; i < G.length; i++) {
    weights[i] = MAX_VALUE;
    // visualize {
    tracer.updateNode(i, weights[i]);
    // }
  }
  weights[src] = 0;
  // visualize {
  tracer.updateNode(src, 0);
  // }

  // logger {
  logger.println(`Initializing weights to: [${weights}]`);
  logger.println('');
  // }

  // begin BF algorithm execution
  let k = G.length;
  while (k--) {
    // logger {
    logger.println(`Iteration: ${G.length - k}`);
    logger.println('------------------------------------------------------------------');
    // }

    for (i = 0; i < G.length; i++) {
      for (j = 0; j < G.length; j++) {
        if (G[i][j]) { // proceed to relax Edges only if a particular weight !== 0 (0 represents no edge)
          if (weights[j] > (weights[i] + G[i][j])) {
            weights[j] = weights[i] + G[i][j];
            // logger {
            logger.println(`weights[${j}] = weights[${i}] + ${G[i][j]}`);
            // }
          }
          // visualize {
          tracer.visit(j, i, weights[j]);
          Tracer.delay();
          tracer.leave(j, i);
          Tracer.delay();
          // }
        }
      }
    }

    // logger {
    logger.println(`updated weights: [${weights.join(', ')}]`);
    logger.println('');
    // }
  }

  // check for cycle
  logger.println('checking for cycle');
  for (i = 0; i < G.length; i++) {
    for (j = 0; j < G.length; j++) {
      if (G[i][j]) {
        if (weights[j] > (weights[i] + G[i][j])) {
          // logger {
          logger.println(`A cycle was detected: weights[${j}] > weights[${i}] + ${G[i][j]}`);
          // }
          return (MAX_VALUE);
        }
      }
    }
  }

  // logger {
  logger.println(`No cycles detected. Final weights for the source ${src} are: [${weights}]`);
  // }

  return weights[dest];
}

const src = Randomize.Integer({ min: 0, max: G.length - 1 });
let dest;
let MAX_VALUE = 0x7fffffff;
let minWeight;

/*
 src = start node
 dest = start node (but will eventually at as the end node)
 */

do {
  dest = Randomize.Integer({ min: 0, max: G.length - 1 });
}
while (src === dest);

// logger {
logger.println(`finding the shortest path from ${src} to ${dest}`);
// }

minWeight = BELLMAN_FORD(src, dest);

// logger {
if (minWeight === MAX_VALUE) {
  logger.println(`there is no path from ${src} to ${dest}`);
} else {
  logger.println(`the shortest path from ${src} to ${dest} is ${minWeight}`);
}
// }
