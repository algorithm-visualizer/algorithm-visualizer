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
const N = D.length;
let swapped;
let gap = N; // initialize gap size
const shrink = 1.3; // set the gap shrink factor

do {
  // update the gap value for the next comb.
  gap = Math.floor(gap / shrink);
  if (gap < 1) {
    // minimum gap is 1
    gap = 1;
  }

  swapped = false; // initialize swapped
  // a single comb over the input list
  for (let i = 0; i + gap < N; i++) {
    // visualize {
    tracer.select(i);
    tracer.select(i + gap);
    Tracer.delay();
    // }

    if (D[i] > D[i + gap]) {
      // logger {
      logger.println(`swap ${D[i]} and ${D[i + gap]}`); // log swap event
      // }
      
      const temp = D[i];
      D[i] = D[i + gap];
      D[i + gap] = temp;

      // visualize {
      tracer.patch(i, D[i]);
      tracer.patch(i + gap, D[i + gap]);
      Tracer.delay();
      tracer.depatch(i);
      tracer.depatch(i + gap);
      // }

      swapped = true; // Flag swapped has happened and list is not guaranteed sorted
    }
    // visualize {
    tracer.deselect(i);
    tracer.deselect(i + gap);
    // }
  } // End of combing
} while (gap !== 1 || swapped);
