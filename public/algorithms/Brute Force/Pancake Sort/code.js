// import visualization libraries {
const { Tracer, Array1DTracer, ChartTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chart = new ChartTracer();
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([chart, tracer, logger]));
const D = Randomize.Array1D({ N: 10 });
tracer.set(D);
tracer.chart(chart);
Tracer.delay();
// }

// logger {
logger.println(`original array = [${D.join(', ')}]`);
// }
const N = D.length;

function flip(start) {
  // visualize {
  tracer.select(start, N - 1);
  Tracer.delay();
  // }
  let idx = 0;
  for (let i = start; i < (start + N) / 2; i++) {
    // visualize {
    tracer.select(i);
    Tracer.delay();
    // }
    const temp = D[i];
    D[i] = D[N - idx - 1];
    D[N - idx - 1] = temp;
    // visualize {
    tracer.patch(i, D[i]);
    tracer.patch(N - idx - 1, D[N - idx - 1]);
    Tracer.delay();
    tracer.depatch(i);
    tracer.depatch(N - idx - 1);
    tracer.deselect(i);
    // }
    idx++;
  }
  // visualize {
  tracer.deselect(start, N - 1);
  // }
}

for (let i = 0; i < N - 1; i++) {
  // logger {
  logger.println(`round ${i + 1}`);
  // }
  const currArr = D.slice(i, N);
  const currMax = currArr.reduce((prev, curr, idx) => ((curr > prev.val) ? { idx, val: curr } : prev), {
    idx: 0,
    val: currArr[0],
  });
  if (currMax.idx !== 0) { // if currMax.idx === 0 that means max element already at the bottom, no flip required
    // logger {
    logger.println(`flip at ${currMax.idx + i} (step 1)`);
    // }
    flip(currMax.idx + i, N);
    // logger {
    logger.println(`flip at ${i} (step 2)`);
    // }
    flip(i, N);
  }
}

// logger {
logger.println(`sorted array = [${D.join(', ')}]`);
// }
