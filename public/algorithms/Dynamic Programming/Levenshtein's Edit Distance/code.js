// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const str1 = 'stack';
const str2 = 'racket';
const table = new Array(str1.length + 1);

for (let i = 0; i < str1.length + 1; i++) {
  table[i] = new Array(str2.length + 1).fill(-1);
  table[i][0] = i;
}
for (let i = 1; i < str2.length + 1; i++) {
  table[0][i] = i;
}

// define tracer variables {
const tracer = new Array2DTracer('Distance Table');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(table);
Tracer.delay();
// }

// logger {
logger.println('Initialized DP Table');
logger.println(`Y-Axis (Top to Bottom): ${str1}`);
logger.println(`X-Axis (Left to Right): ${str2}`);
// }

const dist = (function editDistance(str1, str2, table) {
  // display grid with words
  // logger {
  logger.println(`*** ${str2.split('').join(' ')}`);
  table.forEach((item, index) => {
    const character = (index === 0) ? '*' : str1[index - 1];
    logger.println(`${character}\t${item}`);
  });
  // }

  // begin ED execution
  for (let i = 1; i < str1.length + 1; i++) {
    for (let j = 1; j < str2.length + 1; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // visualize {
        tracer.select(i - 1, j - 1);
        Tracer.delay();
        // }
        table[i][j] = table[i - 1][j - 1];
        // visualize {
        tracer.patch(i, j, table[i][j]);
        Tracer.delay();
        tracer.depatch(i, j);
        tracer.deselect(i - 1, j - 1);
        // }
      } else {
        // visualize {
        tracer.select(i - 1, j);
        tracer.select(i, j - 1);
        tracer.select(i - 1, j - 1);
        Tracer.delay();
        // }
        table[i][j] = Math.min(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1]) + 1;
        // visualize {
        tracer.patch(i, j, table[i][j]);
        Tracer.delay();
        tracer.depatch(i, j);
        tracer.deselect(i - 1, j);
        tracer.deselect(i, j - 1);
        tracer.deselect(i - 1, j - 1);
        // }
      }
    }
  }

  // visualize {
  tracer.select(str1.length, str2.length);
  // }
  return table[str1.length][str2.length];
}(str1, str2, table));

// logger {
logger.println(`Minimum Edit Distance: ${dist}`);
// }
