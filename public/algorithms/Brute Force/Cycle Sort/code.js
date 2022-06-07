// import visualization libraries {
const { Tracer, Array1DTracer, ChartTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chart = new ChartTracer();
const tracer = new Array1DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([chart, tracer, logger]));
const D = Randomize.Array1D({ N: 15 });
tracer.set(D);
tracer.chart(chart);
Tracer.delay();
// }

// logger {
logger.println(`original array = [${D.join(', ')}]`);
// }
const N = D.length;
let writes = 0; // number of writing performed
let pos; // the index of item in the sorted array
let item; // an item in the array
let temp; // a temp value used for storing swapped item
for (let cycleStart = 0; cycleStart <= N - 2; cycleStart++) {
  item = D[cycleStart];

  // find where to put the item
  pos = cycleStart;
  // visualize {
  tracer.select(cycleStart);
  // }

  for (let i = cycleStart + 1; i <= N - 1; i++) {
    // visualize {
    tracer.select(i);
    Tracer.delay();
    tracer.deselect(i);
    // }
    if (D[i] < item) {
      pos++;
    }
  }

  // if the item is already there, this is not a circle
  if (pos === cycleStart) {
    // visualize {
    tracer.deselect(cycleStart);
    // }
    continue;
  }

  // otherwise put the item there or right after any duplicates
  while (item === D[pos]) {
    pos++;
  }

  // write item to new index and increment writes
  temp = D[pos];
  D[pos] = item;
  item = temp;

  writes++;

  // logger {
  if (pos !== cycleStart) {
    logger.println(`Rewrite ${D[pos]} to index ${pos}; the next value to rewrite is ${item}`);
  } else {
    logger.println(`Rewrite ${D[pos]} to index ${pos}`);
  }
  // }
  // visualize {
  tracer.select(pos);
  Tracer.delay();
  tracer.deselect(pos);
  tracer.patch(pos, D[pos]);
  tracer.patch(cycleStart, D[cycleStart]);
  Tracer.delay();
  tracer.depatch(pos);
  tracer.depatch(cycleStart);
  // }

  // rotate the rest of the cycle
  while (pos !== cycleStart) {
    pos = cycleStart;

    for (let i = cycleStart + 1; i <= N - 1; i++) {
      // visualize {
      tracer.select(i);
      Tracer.delay();
      tracer.deselect(i);
      // }
      if (D[i] < item) {
        pos++;
      }
    }

    while (item === D[pos]) {
      pos++;
    }

    temp = D[pos];
    D[pos] = item;
    item = temp;

    // logger {
    if (pos !== cycleStart) {
      logger.println(`Rewrite ${D[pos]} to index ${pos}; the next value to rewrite is ${item}`);
    } else {
      logger.println(`Rewrite ${D[pos]} to index ${pos}`);
    }
    // }
    // visualize {
    tracer.select(pos);
    Tracer.delay();
    tracer.deselect(pos);
    tracer.patch(pos, D[pos]);
    tracer.patch(cycleStart, D[cycleStart]);
    Tracer.delay();
    tracer.depatch(pos);
    tracer.depatch(cycleStart);
    // }

    writes++;
  }
}

// logger {
logger.println(`Number of writes performed is ${writes}`);
// }
