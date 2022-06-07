// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const D = Randomize.Array2D({ N: 5, M: 5, value: () => Randomize.Integer({ min: 1, max: 5 }) });
const dataViewer = new Array2DTracer();
const tracer = new Array2DTracer('Results Table');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([dataViewer, tracer, logger]));
dataViewer.set(D);
const DP = [];
for (let i = 0; i < D.length; i++) {
  DP.push([]);
  for (let j = 0; j < D[i].length; j++) {
    DP[i].push(Infinity);
  }
}
tracer.set(DP);
Tracer.delay();
// }

const N = DP.length;
const M = DP[0].length;

function update(i, j, value) {
  DP[i][j] = value;
  // visualize {
  dataViewer.select(i, j);
  Tracer.delay();
  tracer.patch(i, j, DP[i][j]);
  Tracer.delay();
  tracer.depatch(i, j);
  dataViewer.deselect(i, j);
  // }
}

for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (i === 0 && j === 0) {
      update(i, j, D[i][j]);
    } else if (i === 0) {
      // visualize {
      tracer.select(i, j - 1);
      // }
      update(i, j, DP[i][j - 1] + D[i][j]);
      // visualize {
      tracer.deselect(i, j - 1);
      // }
    } else if (j === 0) {
      // visualize {
      tracer.select(i - 1, j);
      // }
      update(i, j, DP[i - 1][j] + D[i][j]);
      // visualize {
      tracer.deselect(i - 1, j);
      // }
    } else {
      // visualize {
      tracer.select(i, j - 1);
      tracer.select(i - 1, j);
      // }
      update(i, j, Math.max(DP[i][j - 1], DP[i - 1][j]) + D[i][j]);
      // visualize {
      tracer.deselect(i, j - 1);
      tracer.deselect(i - 1, j);
      // }
    }
  }
}
// logger {
logger.println(`max = ${DP[N - 1][M - 1]}`);
// }
