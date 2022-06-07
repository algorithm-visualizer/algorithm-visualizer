// import visualization libraries {
const { Tracer, Array1DTracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const G = [
  [0, 1, 0, 1, 1],
  [1, 0, 1, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 0, 1, 0, 0], // <-- replace latest 0 with 1 to make G not biparted
  [1, 0, 0, 0, 0],
];

// define tracer variables {
const tracer = new GraphTracer().directed(false);
const logger = new LogTracer();
tracer.log(logger);
tracer.set(G);
const colorsTracer = new Array1DTracer('Colors');
Layout.setRoot(new VerticalLayout([tracer, logger, colorsTracer]));
Tracer.delay();
// }

function BFSCheckBipartiteness(s) {
  const Q = [];

  // Create a new matrix to set colors (0,1)
  const Colors = [];
  for (let _i = 0; _i < G.length; _i++) Colors[_i] = -1;
  // visualize {
  colorsTracer.set(Colors);
  // }

  Colors[s] = 1;
  // visualize {
  colorsTracer.patch(s, 1);
  // }

  Q.push(s); // add start node to queue

  while (Q.length > 0) {
    const node = Q.shift(); // dequeue
    // visualize {
    tracer.visit(node);
    Tracer.delay();
    // }

    for (let i = 0; i < G[node].length; i++) {
      if (G[node][i]) {
        if (Colors[i] === -1) {
          Colors[i] = 1 - Colors[node];
          // visualize {
          colorsTracer.patch(i, 1 - Colors[node]);
          // }

          Q.push(i);
          // visualize {
          tracer.visit(i, node);
          Tracer.delay();
          // }
        } else if (Colors[i] === Colors[node]) {
          // logger {
          logger.println('Graph is not biparted');
          // }
          return false;
        }
      }
    }
  }

  // logger {
  logger.println('Graph is biparted');
  // }
  return true;
}

BFSCheckBipartiteness(0);
