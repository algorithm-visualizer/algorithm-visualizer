// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const D = [-2, -3, 4, -1, -2, 1, 5, -3];

// define tracer variables {
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(D);
Tracer.delay();
// }

const maxSubarraySum = (function maxSubarray(array) {
  let maxSoFar = 0;
  let maxEndingHere = 0;

  // logger {
  logger.println('Initializing maxSoFar = 0 & maxEndingHere = 0');
  // }

  for (let i = 0; i < array.length; i++) {
    // visualize {
    tracer.select(i);
    // }
    // logger {
    logger.println(`${maxEndingHere} + ${array[i]}`);
    // }
    maxEndingHere += array[i];
    // logger {
    logger.println(`=> ${maxEndingHere}`);
    // }

    if (maxEndingHere < 0) {
      // logger {
      logger.println('maxEndingHere is negative, set to 0');
      // }
      maxEndingHere = 0;
    }

    if (maxSoFar < maxEndingHere) {
      // logger {
      logger.println(`maxSoFar < maxEndingHere, setting maxSoFar to maxEndingHere (${maxEndingHere})`);
      // }
      maxSoFar = maxEndingHere;
    }

    // visualize {
    Tracer.delay();
    tracer.deselect(i);
    // }
  }

  return maxSoFar;
}(D));

// logger {
logger.println(`Maximum Subarray's Sum is: ${maxSubarraySum}`);
// }
