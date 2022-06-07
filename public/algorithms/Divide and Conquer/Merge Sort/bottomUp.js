// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const tracer = new Array2DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
const D = [
  Randomize.Array1D({ N: 20, value: () => Randomize.Integer({ min: 0, max: 50 }) }),
  Randomize.Array1D({ N: 20, value: () => Randomize.Integer({ min: 0, max: 0 }) }),
];

tracer.set(D);
Tracer.delay();
// }

// logger {
logger.println(`original array = [${D[0].join(', ')}]`);
// }

function mergeSort(start, end) {
  if (Math.abs(end - start) <= 1) return;

  let mergeFrom = 0;
  let mergeTo = 1;
  let width;
  let i;
  for (width = 1; width < end; width *= 2) {
    // visualize {
    logger.println(`merging arrays of width: ${width}`);
    // }
    for (i = 0; i < end; i += 2 * width) {
      merge(mergeFrom, i, Math.min(i + width, end), Math.min(i + 2 * width, end), mergeTo);
    }
    // this could be copy(mergeTo, mergeFrom, start, end);
    // but it is more effecient to swap the input arrays
    // if you did copy here, you wouldn't need the copy at the end
    mergeFrom = (mergeFrom === 0 ? 1 : 0);
    mergeTo = 1 - mergeFrom;
  }
  if (mergeFrom !== 0) {
    // visualize {
    logger.println('final copy to original');
    // }
    copy(mergeFrom, mergeTo, start, end);
  }
}

function merge(mergeFrom, start, middle, end, mergeTo) {
  let i = start;
  let j = middle;
  let k;
  // in an actual merge implementation, mergeFrom and mergeTo would be arrays
  // here for the ability to trace what is going on better, the arrays are D[mergeFrom] and D[mergeTo]
  // visualize {
  logger.println(`merging segments [${start}..${middle}] and [${middle}..${end}]`);
  tracer.selectRow(mergeFrom, start, end - 1);
  Tracer.delay();
  tracer.deselectRow(mergeFrom, start, end - 1);
  // }

  for (k = start; k < end; k++) {
    // visualize {
    if (j < end) {
      tracer.select(mergeFrom, j);
    }
    if (i < middle) {
      tracer.select(mergeFrom, i);
    }
    if (i < middle && j < end) {
      logger.println(`compare index ${i} and ${j}, values: ${D[mergeFrom][i]} and ${D[mergeFrom][j]}`);
      Tracer.delay();
    }
    // }

    if (i < middle && (j >= end || D[mergeFrom][i] <= D[mergeFrom][j])) {
      // visualize {
      if (j < end) {
        logger.println('writing smaller value to output');
      } else {
        logger.println(`copying index ${i} to output`);
      }
      tracer.patch(mergeTo, k, D[mergeFrom][i]);
      Tracer.delay();
      tracer.depatch(mergeTo, k);
      tracer.deselect(mergeFrom, i);
      // }

      D[mergeTo][k] = D[mergeFrom][i];
      i += 1;
    } else {
      // visualize {
      if (i < middle) {
        logger.println('writing smaller value to output');
      } else {
        logger.println(`copying index ${j} to output`);
      }
      tracer.patch(mergeTo, k, D[mergeFrom][j]);
      Tracer.delay();
      tracer.depatch(mergeTo, k);
      tracer.deselect(mergeFrom, j);
      // }

      D[mergeTo][k] = D[mergeFrom][j];
      j += 1;
    }
  }
}

function copy(mergeFrom, mergeTo, start, end) {
  let i;
  for (i = start; i < end; i++) {
    // visualize {
    tracer.select(mergeFrom, i);
    tracer.patch(mergeTo, i, D[mergeFrom][i]);
    Tracer.delay();
    // }

    D[mergeTo][i] = D[mergeFrom][i];

    // visualize {
    tracer.deselect(mergeFrom, i);
    tracer.depatch(mergeTo, i);
    // }
  }
}

mergeSort(0, D[0].length);
// logger {
logger.println(`sorted array = [${D[0].join(', ')}]`);
// }
