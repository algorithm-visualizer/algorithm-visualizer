// import visualization libraries {
const { Tracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([logger]));
Tracer.delay();
// }

for (let i = 0; i < 3; i++) {
  let a = Math.floor(Math.random() * 300);
  if (a % 2 === 0) a += 1;
  testProbablyPrime(a);
  // visualize {
  logger.println('----------');
  // }
}

testProbablyPrime(151);
// visualize {
logger.println('----------');
// }

testProbablyPrime(199, 10);

// Utility function to do modular exponentiation.
// It returns (x^y) % p
function power(x, y, p) {
  let res = 1;
  x %= p;
  while (y > 0) {
    // If y is odd, multiply x with result
    if (y & 1) res = (res * x) % p;
    // y must be even now
    y >>= 1; // y = y/2
    x = (x * x) % p;
  }
  return res;
}


/**
 * Determine if N is prime using Miller-Rabin probabilistic algorithm
 * @param  {Number} n The number
 * @param  {Number} k An integer that determine the accuracy of the solution
 * @return {Boolean}
 */
function testProbablyPrime(n, k = 5) {
  // visualize {
  logger.println(`==> Testing number ${n}`);
  // }

  if (n === 1 || n === 3) {
    // visualize {
    logger.println('==> Simple case, N is 1 or 3');
    // }
    return true;
  }
  if (n % 2 === 0) {
    // visualize {
    logger.println(`==> Simple case, ${n} mod 2 = 0`);
    // }
    return false;
  }

  // Write (n - 1) as 2^s * d
  let d = n - 1;
  while (d % 2 === 0) {
    d /= 2;
  }
  // visualize {
  logger.println(`d = ${d}`);
  // }

  const P = 100 * (1 - (1 / Math.pow(4, k)));

  WitnessLoop: do {
    // visualize {
    logger.println(`Remaining iterations: #${k}`);
    // }

    const a = 2 + Math.floor(Math.random() * (n - 4));
    // visualize {
    logger.println(`--> first test with random = ${a}`);
    // }

    // Compute a^d % n
    let x = power(a, d, n);

    if (x === 1 || x === n - 1) {
      // visualize {
      logger.println('--> continue WitnessLoop, x = 1 or x = n-1');
      // }
      continue;
    }

    // visualize {
    logger.println('--> second test');
    // }

    // Keep squaring x while one of the following doesn't
    // happen
    // (i)   d does not reach n-1
    // (ii)  (x^2) % n is not 1
    // (iii) (x^2) % n is not n-1
    let i = d;
    while (i !== n - 1) {
      x = (x * x) % n;
      i *= 2;

      if (x === 1) {
        // visualize {
        logger.println(`--> exiting, ${n} is composite`);
        // }
        return false;
      }

      if (x === n - 1) {
        // visualize {
        logger.println('--> continue WitnessLoop');
        // }
        continue WitnessLoop;
      }
    }

    // visualize {
    logger.println(`--> exiting, ${n} is composite 'cause (n-1) is reached`);
    // }
    return false;
  } while (--k);

  // visualize {
  logger.println(`End of tests, ${n} is probably prime with probabilty of ${P}%`);
  // }
  return true;
}
