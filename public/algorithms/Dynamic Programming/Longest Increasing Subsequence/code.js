// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
const A = Randomize.Array1D({ N: 10, value: () => Randomize.Integer({ min: 0, max: 10 }) });
const LIS = new Array(A.length);
tracer.set(A);
Tracer.delay();
// }

// Initialize LIS values for all indexes
for (let i = 0; i < A.length; i++) {
  LIS[i] = 1;
}

// logger {
logger.println('Calculating Longest Increasing Subsequence values in bottom up manner ');
// }
// Compute optimized LIS values in bottom up manner
for (let i = 1; i < A.length; i++) {
  // visualize {
  tracer.select(i);
  logger.println(` LIS[${i}] = ${LIS[i]}`);
  // }
  for (let j = 0; j < i; j++) {
    // visualize {
    tracer.patch(j);
    Tracer.delay();
    tracer.depatch(j);
    // }
    if (A[i] > A[j] && LIS[i] < LIS[j] + 1) {
      LIS[i] = LIS[j] + 1;
      // logger {
      logger.println(` LIS[${i}] = ${LIS[i]}`);
      // }
    }
  }
  // visualize {
  tracer.deselect(i);
  // }
}

// Pick maximum of all LIS values
// logger {
logger.println('Now calculate maximum of all LIS values ');
// }
let max = LIS[0];
for (let i = 1; i < A.length; i++) {
  if (max < LIS[i]) {
    max = LIS[i];
  }
}
// logger {
logger.println(`Longest Increasing Subsequence = max of all LIS = ${max}`);
// }
