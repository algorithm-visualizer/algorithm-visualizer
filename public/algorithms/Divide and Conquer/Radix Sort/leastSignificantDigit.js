// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new Array2DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
const k = Randomize.Array1D({ N: 10, value: () => Randomize.Integer({ min: 1, max: 999 }) });
const D = [
  k,
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
tracer.set(D);
Tracer.delay();
// }

// logger {
logger.println(`original array = [${D[0].join(', ')}]`);
// }

function pow(base, expo) {
  let ans = 1;
  for (let i = 0; i < expo; i++) {
    ans *= base;
  }
  return ans;
}

function digit(i, exp) {
  return parseInt(D[0][i] / pow(10, exp) % 10);
}

for (let exp = 0; exp < 3; exp++) {
  // logger {
  logger.println(`Digit: ${exp}`);
  // }
  let i;
  for (i = 0; i < D[0].length; i++) {
    const d = digit(i, exp);
    // visualize {
    tracer.select(0, i);
    Tracer.delay();
    // }
    D[2][d] += 1;
    // visualize {
    tracer.patch(2, d, D[2][d]);
    Tracer.delay();
    tracer.depatch(2, d);
    tracer.deselect(0, i);
    // }
  }
  for (i = 1; i < 10; i++) {
    // visualize {
    tracer.select(2, i - 1);
    Tracer.delay();
    // }
    D[2][i] += D[2][i - 1];
    // visualize {
    tracer.patch(2, i, D[2][i]);
    Tracer.delay();
    tracer.depatch(2, i);
    tracer.deselect(2, i - 1);
    // }
  }
  for (i = D[0].length - 1; i >= 0; i--) {
    const d = digit(i, exp);
    // visualize {
    tracer.select(0, i);
    Tracer.delay();
    // }
    D[2][d] -= 1;
    // visualize {
    tracer.patch(2, d, D[2][d]);
    Tracer.delay();
    tracer.depatch(2, d);
    // }
    D[1][D[2][d]] = D[0][i];
    // visualize {
    tracer.patch(1, D[2][d], D[1][D[2][d]]);
    Tracer.delay();
    tracer.depatch(1, D[2][d]);
    tracer.deselect(0, i);
    // }
  }
  for (i = 0; i < D[0].length; i++) {
    // visualize {
    tracer.select(1, i);
    Tracer.delay();
    // }
    D[0][i] = D[1][i];
    // visualize {
    tracer.patch(0, i, D[0][i]);
    Tracer.delay();
    tracer.depatch(0, i);
    tracer.deselect(1, i);
    // }
  }
  for (i = 0; i < 10; i++) {
    D[2][i] = 0;
    // visualize {
    tracer.patch(2, i, D[2][i]);
    Tracer.delay();
    tracer.depatch(2, i);
    // }
  }
}
// logger {
logger.println(`sorted array = [${D[0].join(', ')}]`);
// }
