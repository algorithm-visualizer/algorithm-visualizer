// import visualization libraries {
const { Array2DTracer, Layout, LogTracer, Tracer, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const array2dTracer = new Array2DTracer('Grid');
const logTracer = new LogTracer('Console');
// }

// define input variables
const messages = [
  'Visualize',
  'your',
  'own',
  'code',
  'here!',
];

// highlight each line of messages recursively
function highlight(line) {
  if (line >= messages.length) return;
  const message = messages[line];
  // visualize {
  logTracer.println(message);
  array2dTracer.selectRow(line, 0, message.length - 1);
  Tracer.delay();
  array2dTracer.deselectRow(line, 0, message.length - 1);
  // }
  highlight(line + 1);
}

(function main() {
  // visualize {
  Layout.setRoot(new VerticalLayout([array2dTracer, logTracer]));
  array2dTracer.set(messages);
  Tracer.delay();
  // }
  highlight(0);
})();
