// import visualization libraries {
const { Tracer, Array1DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const text = ['h', 'e', 'l', 'l', 'o', ' ', 's', 'i', 'r', ' ', 'h', 'e', 'l', 'l', 'o'];
const pattern = ['h', 'e', 'l', 'l', 'o'];

const Q = 101; // A prime number
const D = 256; // number of characters in the input alphabet

// define tracer variables {
const logger = new LogTracer();
const tracer1 = new Array1DTracer('Text');
const tracer2 = new Array1DTracer('Pattern');
Layout.setRoot(new VerticalLayout([logger, tracer1, tracer2]));
tracer1.set(text);
tracer2.set(pattern);
Tracer.delay();
// }

const N = text.length;
const M = pattern.length;

let hashText = 0; // hash value for text
let hashPattern = 0; // hash value for pattern
let h = 1;

for (let i = 0; i < (M - 1); i++) {
  h = (h * D) % Q;
}

for (let i = 0; i < M; i++) {
  hashPattern = (D * hashPattern + pattern[i].charCodeAt(0)) % Q;
  hashText = (D * hashText + text[i].charCodeAt(0)) % Q;
}

for (let i = 0; i <= N - M; i++) {
  /*
  Check if hash values of current window of text matches
  with hash values of pattern. If match is found then
  check for characters one by one
  */
  if (hashPattern === hashText) {
    let f = 0;
    // visualize {
    tracer1.select(i, i + M - 1);
    Tracer.delay();
    tracer2.select(0, M - 1);
    Tracer.delay();
    // }
    for (let j = 0; j < M; j++) {
      // visualize {
      tracer1.patch(i + j);
      Tracer.delay();
      tracer2.patch(j);
      Tracer.delay();
      // }
      if (text[i + j] !== pattern[j]) {
        f++;
      }
      // visualize {
      tracer1.depatch(i + j);
      tracer2.depatch(j);
      // }
    }

    // visualize {
    if (f === 0) {
      logger.println(` Pattern found at index ${i}`);
    }
    tracer1.deselect(i, i + M);
    tracer2.deselect(0, M - 1);
    // }
  }

  /*
  Calculate hash value for next window of text :
  */
  if (i < N - M) {
    hashText = (D * (hashText - text[i].charCodeAt(0) * h) + text[i + M].charCodeAt(0)) % Q;

    // Convert negative value of hashText (if found) to positive
    if (hashText < 0) {
      hashText += Q;
    }
  }
}
