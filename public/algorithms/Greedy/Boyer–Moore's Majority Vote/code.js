// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const A = [1, 3, 3, 2, 1, 1, 1];
const N = A.length;

// define tracer variables {
const tracer = new Array1DTracer('List of element');
const logger = new LogTracer('Console');
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(A);
Tracer.delay();
// }

function isMajorityElement(element) {
  let count = 0;
  // logger {
  logger.println(`Verify majority element ${element}`);
  // }
  for (let i = N - 1; i >= 0; i--) {
    // visualize {
    tracer.patch(i, A[i]);
    Tracer.delay();
    // }
    if (A[i] === element) {
      count++;
    } else {
      // visualize {
      tracer.depatch(i);
      // }
    }
  }
  // logger {
  logger.println(`Count of our assumed majority element ${count}`);
  // }
  if (count > Math.floor(N / 2)) {
    // logger {
    logger.println('Our assumption was correct!');
    // }
    return true;
  }
  // logger {
  logger.println('Our assumption was incorrect!');
  // }
  return false;
}

function findProbableElement() {
  let index = 0;
  let count = 1;
  // visualize {
  tracer.select(index);
  Tracer.delay();
  // }
  // logger {
  logger.println(`Beginning with assumed majority element : ${A[index]} count : ${count}`);
  logger.println('--------------------------------------------------------');
  // }
  for (let i = 1; i < N; i++) {
    // visualize {
    tracer.patch(i, A[i]);
    Tracer.delay();
    // }
    if (A[index] === A[i]) {
      count++;
      // logger {
      logger.println(`Same as assumed majority element! Count : ${count}`);
      // }
    } else {
      count--;
      // logger {
      logger.println(`Not same as assumed majority element! Count : ${count}`);
      // }
    }

    if (count === 0) {
      // logger {
      logger.println('Wrong assumption in majority element');
      // }
      // visualize {
      tracer.deselect(index);
      tracer.depatch(i);
      // }
      index = i;
      count = 1;
      // visualize {
      tracer.select(i);
      Tracer.delay();
      // }
      // logger {
      logger.println(`New assumed majority element!${A[i]} Count : ${count}`);
      logger.println('--------------------------------------------------------');
      // }
    } else {
      // visualize {
      tracer.depatch(i);
      // }
    }
  }
  // logger {
  logger.println(`Finally assumed majority element ${A[index]}`);
  logger.println('--------------------------------------------------------');
  // }
  return A[index];
}

function findMajorityElement() {
  const element = findProbableElement();
  // logger {
  if (isMajorityElement(element) === true) {
    logger.println(`Majority element is ${element}`);
  } else {
    logger.println('No majority element');
  }
  // }
}

findMajorityElement();
