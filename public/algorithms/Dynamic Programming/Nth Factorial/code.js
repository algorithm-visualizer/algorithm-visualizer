// import visualization libraries {
const { Tracer, Array1DTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new Array1DTracer('Sequence');
Layout.setRoot(new VerticalLayout([tracer]));
const index = 15;
const D = [1];
for (let i = 1; i < index; i++) {
  D.push(0);
}
tracer.set(D);
Tracer.delay();
// }

for (let i = 1; i < index; i++) {
  D[i] = D[i - 1] * i;
  // visualize {
  tracer.select(i - 1);
  Tracer.delay();
  tracer.patch(i, D[i]);
  Tracer.delay();
  tracer.depatch(i);
  tracer.deselect(i - 1);
  // }
}
