// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const N = 10;
const A = new Array(N + 1);
for (let i = N; i >= 0; i--) {
  A[i] = 0;
}

// define tracer variables {
const tracer = new Array1DTracer(' Catalan Numbers ');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(A);
Tracer.delay();
// }

A[0] = 1;
// visualize {
tracer.patch(0, A[0]);
Tracer.delay();
tracer.depatch(0);
// }
A[1] = 1;
// visualize {
tracer.patch(1, A[1]);
Tracer.delay();
tracer.depatch(1);
// }

for (let i = 2; i <= N; i++) {
  for (let j = 0; j < i; j++) {
    A[i] += A[j] * A[i - j - 1];
    // visualize {
    tracer.select(j);
    Tracer.delay();
    tracer.select(i - j - 1);
    Tracer.delay();
    tracer.patch(i, A[i]);
    Tracer.delay();
    tracer.deselect(j);
    tracer.deselect(i - j - 1);
    tracer.depatch(i);
    // }
  }
}

// visualize {
logger.println(` The ${N}th Catalan Number is ${A[N]}`);
tracer.select(N);
Tracer.delay();
// }
