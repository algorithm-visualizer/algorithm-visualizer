// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const n = 7;
const A = new Array(n);
for (let i = n - 1; i >= 0; i--) {
  A[i] = new Array(n);
}

for (let i = n - 1; i >= 0; i--) {
  for (let j = n - 1; j >= 0; j--) {
    A[i][j] = 0;
  }
}

// define tracer variables {
const tracer = new Array2DTracer('Magic Square');
const logTracer = new LogTracer('Console');
Layout.setRoot(new VerticalLayout([tracer, logTracer]));
tracer.set(A);
Tracer.delay();
// }

let i = Math.floor(n / 2);
let j = n - 1;

for (let num = 1; num <= n * n;) {
  // logger {
  logTracer.println(`i = ${i}`);
  logTracer.println(`j = ${j}`);
  // }

  if (i === -1 && j === n) {
    j = n - 2;
    i = 0;

    // logger {
    logTracer.println('Changing : ');
    logTracer.println(`i = ${i}`);
    logTracer.println(`j = ${j}`);
    // }
  } else {
    if (j === n) {
      j = 0;
      // logger {
      logTracer.println(`Changing : j = ${j}`);
      // }
    }
    if (i < 0) {
      i = n - 1;
      // logger {
      logTracer.println(`Changing : i = ${i}`);
      // }
    }
  }

  if (A[i][j] > 0) {
    // logger {
    logTracer.println(`Cell already filled : Changing i = ${i} j = ${j}`);
    // }
    j -= 2;
    i++;
  } else {
    A[i][j] = num++;
    // visualize {
    tracer.patch(i, j, A[i][j]);
    Tracer.delay();
    tracer.depatch(i, j);
    tracer.select(i, j);
    Tracer.delay();
    // }
    j++;
    i--;
  }
}

// logger {
logTracer.println(`Magic Constant is ${n * (n * n + 1) / 2}`);
// }
