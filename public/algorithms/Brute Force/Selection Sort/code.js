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
for (let i = 0; i < D.length - 1; i++) {
  let minJ = i;
  // visualize {
  tracer.select(i);
  Tracer.delay();
  // }
  for (let j = i + 1; j < D.length; j++) {
    // visualize {
    tracer.select(j);
    Tracer.delay();
    // }
    if (D[j] < D[minJ]) {
      minJ = j;
      // visualize {
      tracer.patch(j);
      Tracer.delay();
      tracer.depatch(j);
      // }
    }
    // visualize {
    tracer.deselect(j);
    // }
  }
  if (minJ !== i) {
    // logger {
    logger.println(`swap ${D[i]} and ${D[minJ]}`);
    // }
    const temp = D[i];
    D[i] = D[minJ];
    D[minJ] = temp;
    // visualize {
    tracer.patch(i, D[i]);
    tracer.patch(minJ, D[minJ]);
    Tracer.delay();
    tracer.depatch(i);
    tracer.depatch(minJ);
    // }
  }
  // visualize {
  tracer.deselect(i);
  // }
}
// logger {
logger.println(`sorted array = [${D.join(', ')}]`);
// }
