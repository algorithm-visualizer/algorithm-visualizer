// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// let pattern = "aab";
// let text = "aabxaabxcaabxaabxay";
const pattern = 'abc';
const text = 'xabcabzabc';

const len = pattern.length + text.length + 1;

const z = new Array(len);
z[0] = 0;

// define tracer variables {
const textTracer = new Array1DTracer('text');
const pattTracer = new Array1DTracer('pattern');
const concatTracer = new Array1DTracer('concatenated string');
const tracer = new Array1DTracer('zArray');
pattTracer.set(pattern);
textTracer.set(text);
tracer.set(z);
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([textTracer, pattTracer, concatTracer, tracer, logger]));
Tracer.delay();
// }

function createZarr(concat) {
  let left;
  let right;
  let N;
  N = concat.length;
  left = 0;
  right = 0;
  for (let i = 1; i < N; i++) {
    // visualize {
    tracer.select(i);
    Tracer.delay();
    // }
    if (i > right) {
      left = right = i;
      while (right < N && concat[right] === concat[right - left]) {
        // visualize {
        concatTracer.patch(right);
        concatTracer.select(right - left);
        logger.println(`${concat[right]} (at index ${right}) is equal to ${concat[right - left]} (at index ${right - left})`);
        Tracer.delay();
        concatTracer.depatch(right);
        concatTracer.deselect(right - left);
        // }
        right++;
      }
      // visualize {
      if (right < N) {
        concatTracer.patch(right);
        concatTracer.select(right - left);
        logger.println(`${concat[right]} (at index ${right}) is NOT equal to ${concat[right - left]} (at index ${right - left})`);
        Tracer.delay();
        concatTracer.depatch(right);
        concatTracer.deselect(right - left);
      }
      // }
      z[i] = (right - left);
      // logger {
      logger.println('--------------------------------');
      logger.println(`Value of z[${i}] = the length of the substring starting from ${i} which is also the prefix of the concatinated string(=${right - left})`);
      logger.println('--------------------------------');
      // }
      right--;
    } else if (z[i - left] < (right - i + 1)) {
      // visualize {
      logger.println(`The substring from index ${i - left} will not cross the right end.`);
      concatTracer.patch(right - i + 1);
      concatTracer.select(i - left);
      Tracer.delay();
      // }
      z[i] = z[i - left];
      // visualize {
      concatTracer.depatch(right - i + 1);
      concatTracer.deselect(i - left);
      // }
    } else {
      // logger {
      logger.println(`The substring from index ${i - left} will cross the right end.`);
      // }
      left = i;
      while (right < N && concat[right] === concat[right - left]) {
        // visualize {
        concatTracer.patch(right);
        concatTracer.select(right - left);
        logger.println(`${concat[right]} (at index ${right}) is equal to ${concat[right - left]} (at index ${right - left})`);
        Tracer.delay();
        concatTracer.depatch(right);
        concatTracer.deselect(right - left);
        // }
        right++;
      }
      // visualize {
      if (right < N) {
        concatTracer.patch(right);
        concatTracer.select(right - left);
        logger.println(`${concat[right]} (at index ${right}) is NOT equal to ${concat[right - left]} (at index ${right - left})`);
        Tracer.delay();
        concatTracer.depatch(right);
        concatTracer.deselect(right - left);
      }
      // }
      z[i] = (right - left);
      right--;
      // logger {
      logger.println('--------------------------------');
      logger.println(`Value of z[${i}] = the length of the substring starting from ${i} which is also the prefix of the concatinated string(=${right - left})`);
      logger.println('--------------------------------');
      // }
    }
    // visualize {
    tracer.deselect(i);
    tracer.set(z);
    // }
  }
}

const concat = `${pattern}$${text}`;
// visualize {
concatTracer.set(concat);
// }
const patLen = pattern.length;
createZarr(concat);
// visualize {
tracer.set(z);
// }
// logger {
logger.println('The Values in Z array equal to the length of the pattern indicates the index at which the pattern is present');
logger.println('===================================');
for (let i = 0; i < len; i++) {
  if (z[i] === patLen) {
    const pos = i - (patLen + 1);
    logger.println(`Pattern Found at index ${pos}`);
  }
}
logger.println('===================================');
// }
