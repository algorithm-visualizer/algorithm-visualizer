// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const string1 = 'AGGTAB';
const string2 = 'GXTXAYB';
const m = string1.length;
const n = string2.length;
const A = new Array(m + 1);
for (let i = 0; i < m + 1; i++) {
  A[i] = new Array(n + 1);
}

// define tracer variables {
const tracer1 = new Array1DTracer('String 1');
const tracer2 = new Array1DTracer('String 2');
const tracer3 = new Array2DTracer('Memo Table');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer1, tracer2, tracer3, logger]));
tracer1.set(string1);
tracer2.set(string2);
tracer3.set(A);
Tracer.delay();
// }

let i;
let j;

// Fill memo table in bottom up manner
for (i = 0; i <= m; i++) {
  for (j = 0; j <= n; j++) {
    if (i === 0) {
      A[i][j] = j;
    } else if (j === 0) {
      A[i][j] = i;
    } else if (string1[i - 1] === string2[j - 1]) {
      // visualize {
      tracer1.select(i - 1);
      Tracer.delay();
      tracer2.select(j - 1);
      Tracer.delay();
      tracer3.select(i - 1, j - 1);
      Tracer.delay();
      // }

      A[i][j] = A[i - 1][j - 1] + 1;

      // visualize {
      tracer1.deselect(i - 1);
      tracer2.deselect(j - 1);
      tracer3.deselect(i - 1, j - 1);
      // }
    } else {
      // visualize {
      tracer3.select(i - 1, j);
      Tracer.delay();
      tracer3.select(i, j - 1);
      Tracer.delay();
      // }

      if (A[i - 1][j] < A[i][j - 1]) {
        A[i][j] = 1 + A[i - 1][j];
      } else {
        A[i][j] = 1 + A[i][j - 1];
      }

      // visualize {
      tracer3.deselect(i - 1, j);
      tracer3.deselect(i, j - 1);
      // }
    }
    // visualize {
    tracer3.patch(i, j, A[i][j]);
    Tracer.delay();
    tracer3.depatch(i, j);
    // }
  }
}

// logger {
logger.println(`Shortest Common Supersequence is ${A[m][n]}`);
// }
