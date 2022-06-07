// import visualization libraries {
const { Tracer, Array1DTracer, ChartTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chart = new ChartTracer();
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([chart, tracer, logger]));
const D = Randomize.Array1D({ N: 15, value: () => Randomize.Integer({ min: 0, max: 50 }), sorted: true });
tracer.set(D);
tracer.chart(chart);
Tracer.delay();
// }

function BinarySearch(array, element) { // array = sorted array, element = element to be found
  let minIndex = 0;
  let maxIndex = array.length - 1;
  let testElement;

  while (minIndex <= maxIndex) {
    const middleIndex = Math.floor((minIndex + maxIndex) / 2);
    testElement = array[middleIndex];

    // visualize {
    tracer.select(minIndex, maxIndex);
    Tracer.delay();
    tracer.patch(middleIndex);
    logger.println(`Searching at index: ${middleIndex}`);
    Tracer.delay();
    tracer.depatch(middleIndex);
    tracer.deselect(minIndex, maxIndex);
    // }

    if (testElement < element) {
      // logger {
      logger.println('Going right.');
      // }
      minIndex = middleIndex + 1;
    } else if (testElement > element) {
      // logger {
      logger.println('Going left.');
      // }
      maxIndex = middleIndex - 1;
    } else {
      // visualize {
      logger.println(`${element} is found at position ${middleIndex}!`);
      tracer.select(middleIndex);
      // }

      return middleIndex;
    }
  }

  // logger {
  logger.println(`${element} is not found!`);
  // }
  return -1;
}

const element = D[Randomize.Integer({ min: 0, max: D.length - 1 })];

// logger {
logger.println(`Using iterative binary search to find ${element}`);
// }
BinarySearch(D, element);
