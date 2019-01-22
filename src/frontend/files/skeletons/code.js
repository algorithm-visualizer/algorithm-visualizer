// import visualization libraries
import { Array2DTracer, LogTracer } from 'algorithm-visualizer';

// define tracer variables
const array2dTracer = new Array2DTracer('Grid');
const logTracer = new LogTracer('Console');

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
  {
    logTracer.print(message);
    array2dTracer.selectRow(line, 0, message.length - 1).delay();
    array2dTracer.deselectRow(line, 0, message.length - 1);
  }
  highlight(line + 1);
}

(function main() {
  {
    array2dTracer.set(messages).delay();
  }
  highlight(0);
})();
