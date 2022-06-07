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
for (let i = 1; i < D.length; i++) {
  const key = D[i];
  // visualize {
  logger.println(`insert ${key}`);
  tracer.select(i);
  Tracer.delay();
  // }
  let j;
  for (j = i - 1; (j >= 0) && (D[j] > key); j--) {
    D[j + 1] = D[j];
    // visualize {
    tracer.patch(j + 1, D[j + 1]);
    Tracer.delay();
    tracer.depatch(j + 1);
    // }
  }
  D[j + 1] = key;
  // visualize {
  tracer.patch(j + 1, D[j + 1]);
  Tracer.delay();
  tracer.depatch(j + 1);
  tracer.deselect(i);
  // }
}
// logger {
logger.println(`sorted array = [${D.join(', ')}]`);
// }
