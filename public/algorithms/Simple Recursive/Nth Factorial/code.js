// import visualization libraries {
const { Tracer, Array1DTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
var tracer = new Array1DTracer('Sequence');
Layout.setRoot(new VerticalLayout([tracer]));
var index = 15;
var D = [1];
for (var i = 1; i < index; i++) {
  D.push(0);
}
tracer.set(D);
Tracer.delay();
// }

function fact(num) {
  if (num < 0) {
    return;
  }

  if (num === 0) {
    return 1;
  }

  var res = num * fact(num - 1);

  D[num - 1] = res;
  
  // visualize {
  tracer.select(num - 1);
  Tracer.delay();
  tracer.patch(num - 1, D[num - 1]);
  Tracer.delay();
  tracer.depatch(num - 1);
  tracer.deselect(num - 1);
  // }

  return res;
}
fact(index);