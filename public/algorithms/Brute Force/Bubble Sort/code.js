// import visualization libraries {
const { Tracer, Array1DTracer, ChartTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chart = new ChartTracer();
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([chart, tracer, logger]));
const D = Randomize.Array1D({ N: 15 });
tracer.set(D);
tracer.chart(chart);
Tracer.delay();
// }

// logger {
logger.println(`original array = [${D.join(', ')}]`);
// }
let N = D.length;
let swapped;
do {
  swapped = false;
  // visualize {
  tracer.select(N - 1);
  Tracer.delay();
  // }
  for (let i = 1; i < N; i++) {
    // visualize {
    tracer.select(i);
    Tracer.delay();
    // }
    if (D[i - 1] > D[i]) {
      // logger {
      logger.println(`swap ${D[i - 1]} and ${D[i]}`);
      // }
      const temp = D[i - 1];
      D[i - 1] = D[i];
      D[i] = temp;
      swapped = true;
      // visualize {
      tracer.patch(i - 1, D[i - 1]);
      tracer.patch(i, D[i]);
      Tracer.delay();
      tracer.depatch(i - 1);
      tracer.depatch(i);
      // }
    }
    // visualize {
    tracer.deselect(i);
    // }
  }
  // visualize {
  tracer.deselect(N - 1);
  // }
  N--;
} while (swapped);
// logger {
logger.println(`sorted array = [${D.join(', ')}]`);
// }
