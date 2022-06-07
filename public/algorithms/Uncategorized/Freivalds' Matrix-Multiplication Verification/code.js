// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const A = [[2, 3], [3, 4]];
const B = [[1, 0], [1, 2]];
const C = [[6, 5], [8, 7]];

// define tracer variables {
const matrixATracer = new Array2DTracer('Matrix A');
const matrixBTracer = new Array2DTracer('Matrix B');
const matrixCTracer = new Array2DTracer('Matrix C');
const randomVectorTracer = new Array1DTracer('Random Vector');
const resultVectorTracer = new Array1DTracer('Result Vector');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([matrixATracer, matrixBTracer, matrixCTracer, randomVectorTracer, resultVectorTracer, logger]));
matrixATracer.set(A);
matrixBTracer.set(B);
matrixCTracer.set(C);
Tracer.delay();
// }

function FreivaldsAlgorithm() {
  let k = 5;
  let i;
  let j;
  let tmp;
  let tmpB;
  let tmpC;
  const n = A.length;

  while (k--) {
    // logger {
    logger.println(`Iterations remained: #${k}`);
    // }

    // Generate random vector
    const r = [];

    let P = [];
    for (i = 0; i < n; i++) {
      P.push(-1);
      r.push((Math.random() < 0.5) << 0);
    }
    // visualize {
    randomVectorTracer.set(r);
    Tracer.delay();
    // }

    // Compute Br, Cr
    const Br = [];

    const Cr = [];
    for (i = 0; i < n; i++) {
      tmpB = 0;
      tmpC = 0;
      for (j = 0; j < n; j++) {
        tmpB += r[j] * B[j][i];
        tmpC += r[j] * C[j][i];
      }
      Br.push(tmpB);
      Cr.push(tmpC);
    }

    // Compute A * Br - Cr
    P = [];
    for (i = 0; i < n; i++) {
      tmp = 0;
      for (j = 0; j < n; j++) {
        tmp += (A[i][j] * Br[i]) - Cr[i];
      }
      P.push(tmp);
    }
    // visualize {
    resultVectorTracer.set(P);
    Tracer.delay();
    // }

    for (i = 0; i < n; i++) {
      if (P[i] !== 0) {
        // logger {
        logger.println(`P[${i}] !== 0 (${P[i]}), exit`);
        // }
        return false;
      }
    }

    // logger {
    logger.println('Result vector is identity, continue...');
    // }
  }

  return true;
}

FreivaldsAlgorithm();
