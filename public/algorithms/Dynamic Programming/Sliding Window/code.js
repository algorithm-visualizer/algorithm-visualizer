// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
const D = Randomize.Array1D({ N: 20, value: () => Randomize.Integer({ min: -5, max: 5 }) });
tracer.set(D);
Tracer.delay();
// }

let sum = D[0] + D[1] + D[2];
let max = sum;
// visualize {
tracer.select(0, 2);
logger.println(`sum = ${sum}`);
Tracer.delay();
// }
for (let i = 3; i < D.length; i++) {
  sum += D[i] - D[i - 3];
  if (max < sum) max = sum;
  // visualize {
  tracer.deselect(i - 3);
  tracer.select(i);
  logger.println(`sum = ${sum}`);
  Tracer.delay();
  // }
}
// visualize {
tracer.deselect(D.length - 3, D.length - 1);
logger.println(`max = ${max}`);
// }
