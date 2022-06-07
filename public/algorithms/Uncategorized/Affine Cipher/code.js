// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const plainText = 'secret';

// define tracer variables {
const ptTracer = new Array1DTracer('Encryption');
const ctTracer = new Array1DTracer('Decryption');
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([ptTracer, ctTracer, logger]));

ptTracer.set(plainText);
Tracer.delay();
// }

/*
 code assumes that plainText contains ONLY LOWER CASE ALPHABETS
 */

Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

const keys = { a: 5, b: 7 };
const N = 26;

function encrypt(plainText) {
  let cypherText = '';

  function cryptAlpha(alpha) {
    const index = alpha.charCodeAt(0) - 'a'.charCodeAt(0);
    let result = ((keys.a * index) + keys.b).mod(N);

    // logger {
    logger.println(`Index of ${alpha} = ${index}`);
    // }

    result += 'a'.charCodeAt(0);
    return String.fromCharCode(result);
  }

  // logger {
  logger.println('Beginning Affine Encryption');
  logger.println('Encryption formula: <b>((keys.a * indexOfAlphabet) + keys.b) % N</b>');
  logger.println(`keys.a=${keys.a}, keys.b=${keys.b}, N=${N}`);
  // }

  for (const i in plainText) {
    // visualize {
    ptTracer.select(i);
    Tracer.delay();
    ptTracer.deselect(i);
    // }

    cypherText += cryptAlpha(plainText[i]);

    // visualize {
    ptTracer.patch(i, cypherText.slice(-1));
    Tracer.delay();
    ptTracer.depatch(i);
    // }
  }

  return cypherText;
}

function decrypt(cypherText) {
  let plainText = '';
  const aInverse = ((() => {
    for (let i = 1; i < N; i++) {
      if (((keys.a * i).mod(N)) === 1) {
        return i;
      }
    }
  })());

  // logger {
  logger.println(`a<sup>-1</sup> = ${aInverse}`);
  // }

  function decryptAlpha(alpha) {
    const index = alpha.charCodeAt(0) - 'a'.charCodeAt(0);
    let result = (aInverse * (index - keys.b)).mod(N);

    // logger {
    logger.println(`Index of ${alpha} = ${index}`);
    // }

    result += 'a'.charCodeAt(0);
    return String.fromCharCode(result);
  }

  // logger {
  logger.println('Beginning Affine Decryption');
  logger.println('Decryption formula: <b>(a<sup>-1</sup> * (index - keys.b)) % N</b>');
  logger.println(`keys.b=${keys.b}, N=${N}`);
  // }

  for (const i in cypherText) {
    // visualize {
    ctTracer.select(i);
    Tracer.delay();
    ctTracer.deselect(i);
    Tracer.delay();
    // }

    plainText += decryptAlpha(cypherText[i]);

    // visualize {
    ctTracer.patch(i, plainText.slice(-1));
    Tracer.delay();
    ctTracer.depatch(i);
    Tracer.delay();
    // }
  }

  return plainText;
}

const cipherText = encrypt(plainText);
ctTracer.set(cipherText);
decrypt(cipherText);
