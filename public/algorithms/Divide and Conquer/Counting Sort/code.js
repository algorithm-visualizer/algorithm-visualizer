// import visualization libraries {
const { Tracer, Array1DTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const arrayTracer = new Array1DTracer('Array');
const countsTracer = new Array1DTracer('Counts');
const sortedArrayTracer = new Array1DTracer('Sorted Array');
Layout.setRoot(new VerticalLayout([arrayTracer, countsTracer, sortedArrayTracer]));
// }

// define input variables
const N = 20; // the size of an array
const array = Randomize.Array1D({ N, value: () => Randomize.Integer({ min: 0, max: 9 }) });

(function main() {
  // find the maximum value that will decide the size of counts array
  const max = Math.max(...array);
  const counts = new Array(max + 1).fill(0);
  // visualize {
  arrayTracer.set(array);
  countsTracer.set(counts);
  Tracer.delay();
  // }

  // store counts of each number
  for (let i = 0; i < N; i++) {
    const number = array[i];
    counts[number]++;
    // visualize {
    arrayTracer.select(i);
    countsTracer.patch(number, counts[number]);
    Tracer.delay();
    countsTracer.depatch(number);
    arrayTracer.deselect(i);
    // }
  }

  // calculate the prefix sums
  for (let i = 1; i <= max; i++) {
    counts[i] += counts[i - 1];
    // visualize {
    countsTracer;
    countsTracer.select(i - 1);
    countsTracer.patch(i, counts[i]);
    Tracer.delay();
    countsTracer.depatch(i);
    countsTracer.deselect(i - 1);
    // }
  }

  // create a sorted array based on the prefix sums
  const sortedArray = new Array(N);
  // visualize {
  sortedArrayTracer.set(sortedArray);
  // }
  for (let i = N - 1; i >= 0; i--) {
    const number = array[i];
    const count = counts[number];
    sortedArray[count - 1] = number;
    counts[number]--;
    // visualize {
    arrayTracer.select(i);
    countsTracer.select(number);
    sortedArrayTracer.patch(count - 1, sortedArray[count - 1]);
    countsTracer.patch(number, counts[number]);
    Tracer.delay();
    sortedArrayTracer.depatch(count - 1);
    countsTracer.depatch(number);
    countsTracer.deselect(number);
    arrayTracer.deselect(i);
    // }
  }
})();
