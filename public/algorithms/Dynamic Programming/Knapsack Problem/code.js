// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const val = [1, 4, 5, 7]; // The value of all available items
const wt = [1, 3, 4, 5]; // The weights of available items
const W = 7; // The maximum weight we can carry in our collection
const N = val.length;
const DP = new Array(N + 1);

for (let i = 0; i < N + 1; i++) {
  DP[i] = new Array(W + 1);
  for (let j = 0; j < W + 1; j++) {
    DP[i][j] = 0;
  }
}

// define tracer variables {
const tracer = new Array2DTracer('Knapsack Table');
const valuesTracer = new Array1DTracer('Values');
const weightsTracer = new Array1DTracer('Weights');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, valuesTracer, weightsTracer, logger]));
tracer.set(DP);
valuesTracer.set(val);
weightsTracer.set(wt);
Tracer.delay();
// }

for (let i = 0; i <= N; i++) {
  for (let j = 0; j <= W; j++) {
    if (i === 0 || j === 0) {
      /*
      If we have no items or maximum weight we can take in collection is 0
      then the total weight in our collection is 0
      */
      DP[i][0] = 0;
      // visualize {
      tracer.patch(i, j, DP[i][j]);
      Tracer.delay();
      tracer.depatch(i, j);
      // }
    } else if (wt[i - 1] <= j) { // take the current item in our collection
      // visualize {
      weightsTracer.select(i - 1);
      valuesTracer.select(i - 1);
      Tracer.delay();
      tracer.select(i - 1, j - wt[i - 1]);
      tracer.select(i - 1, j);
      Tracer.delay();
      // }
      const A = val[i - 1] + DP[i - 1][j - wt[i - 1]];
      const B = DP[i - 1][j];
      /*
      find the maximum of these two values
      and take which gives us a greater weight
       */
      if (A > B) {
        DP[i][j] = A;
        // visualize {
        tracer.patch(i, j, DP[i][j]);
        Tracer.delay();
        // }
      } else {
        DP[i][j] = B;
        // visualize {
        tracer.patch(i, j, DP[i][j]);
        Tracer.delay();
        // }
      }
      // visualize {
      // opt subproblem depatch
      tracer.depatch(i, j);
      tracer.deselect(i - 1, j);
      tracer.deselect(i - 1, j - wt[i - 1]);
      valuesTracer.deselect(i - 1);
      weightsTracer.deselect(i - 1);
      // }
    } else { // leave the current item from our collection
      DP[i][j] = DP[i - 1][j];
      // visualize {
      tracer.patch(i, j, DP[i][j]);
      Tracer.delay();
      tracer.depatch(i, j);
      // }
    }
  }
}

// logger {
logger.println(` Best value we can achieve is ${DP[N][W]}`);
// }
