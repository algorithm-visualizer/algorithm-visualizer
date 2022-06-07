// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const N = 15;
const A = new Array(N);
for (let i = N - 1; i >= 0; i--) {
  A[i] = 0;
}
A[0] = 1; // By convention 1 is an ugly number

const M = [2, 3, 5]; // multiples of 2, 3, 5 respectively
const I = [0, 0, 0]; // iterators of 2, 3, 5 respectively

// define tracer variables {
const tracer = new Array1DTracer('Ugly Numbers');
const tracer2 = new Array1DTracer('Multiples of 2, 3, 5');
const tracer3 = new Array1DTracer(' Iterators I0, I1, I2 ');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, tracer2, tracer3, logger]));
tracer.set(A);
tracer2.set(M);
tracer3.set(I);
Tracer.delay();
// }

for (let i = 1; i < N; i++) {
  // next is minimum of m2, m3 and m5
  const next = (M[0] <= M[1]) ? (M[0] <= M[2]) ? M[0] : M[2] : (M[1] <= M[2]) ? M[1] : M[2];
  // logger {
  logger.println(` Minimum of ${M[0]}, ${M[1]}, ${M[2]} : ${next}`);
  // }
  A[i] = next;

  // visualize {
  tracer.patch(i, A[i]);
  Tracer.delay();
  tracer.depatch(i);
  // }

  if (next === M[0]) {
    I[0]++;
    M[0] = A[I[0]] * 2;
    // visualize {
    tracer2.patch(0, M[0]);
    Tracer.delay();
    tracer3.patch(0, I[0]);
    Tracer.delay();
    tracer2.depatch(0);
    tracer3.depatch(0);
    // }
  }
  if (next === M[1]) {
    I[1]++;
    M[1] = A[I[1]] * 3;
    // visualize {
    tracer2.patch(1, M[1]);
    Tracer.delay();
    tracer3.patch(1, I[1]);
    Tracer.delay();
    tracer2.depatch(1);
    tracer3.depatch(1);
    // }
  }
  if (next === M[2]) {
    I[2]++;
    M[2] = A[I[2]] * 5;
    // visualize {
    tracer2.patch(2, M[2]);
    Tracer.delay();
    tracer3.patch(2, I[2]);
    Tracer.delay();
    tracer2.depatch(2);
    tracer3.depatch(2);
    // }
  }
}
