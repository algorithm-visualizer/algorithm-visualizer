// import visualization libraries {
const { Tracer, Array1DTracer, ChartTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chart = new ChartTracer();
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([chart, tracer, logger]));
const D = Randomize.Array1D({ N: 10 });
tracer.set(D);
tracer.chart(chart);
Tracer.delay();
// }

// logger {
logger.println(`Original array = [${D.join(', ')}]`);
// }

function heapSort(array, size) {
  let i;
  let j;
  let temp;

  for (i = Math.floor(size / 2) - 1; i >= 0; i--) {
    heapify(array, size, i);
  }

  for (j = size - 1; j >= 0; j--) {
    temp = array[0];
    array[0] = array[j];
    array[j] = temp;

    // visualize {
    tracer.patch(0, array[0]);
    tracer.patch(j, array[j]);
    logger.println(`Swapping elements : ${array[0]} & ${array[j]}`);
    Tracer.delay();
    tracer.depatch(0);
    tracer.depatch(j);
    tracer.select(j);
    Tracer.delay();
    // }

    heapify(array, j, 0);

    // visualize {
    tracer.deselect(j);
    // }
  }
}

function heapify(array, size, root) {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;
  let temp;

  if (left < size && array[left] > array[largest]) {
    largest = left;
  }

  if (right < size && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== root) {
    temp = array[root];
    array[root] = array[largest];
    array[largest] = temp;

    // visualize {
    tracer.patch(root, array[root]);
    tracer.patch(largest, array[largest]);
    logger.println(`Swapping elements : ${array[root]} & ${array[largest]}`);
    Tracer.delay();
    tracer.depatch(root);
    tracer.depatch(largest);
    // }

    heapify(array, size, largest);
  }
}

heapSort(D, D.length);

// logger {
logger.println(`Final array = [${D.join(', ')}]`);
// }
