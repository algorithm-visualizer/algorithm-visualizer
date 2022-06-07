// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, ChartTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

// define tracer variables {
const chartTracer = new ChartTracer('Chart');
const arrayTracer = new Array1DTracer('Array');
const bucketsTracer = new Array2DTracer('Buckets');
Layout.setRoot(new VerticalLayout([chartTracer, arrayTracer, bucketsTracer]));
// }

// define input variables
const N = 25; // the size of an array
const K = 5; // the number of buckets
const array = Randomize.Array1D({ N, value: () => Randomize.Integer({ min: 0, max: 999 }) });

(function main() {
  // create K buckets
  const buckets = [...new Array(K)].map(() => []);
  // visualize {
  arrayTracer.chart(chartTracer);
  arrayTracer.set(array);
  bucketsTracer.set(buckets);
  Tracer.delay();
  // }

  // find the maximum value that will be used for distribution
  const max = Math.max(...array);

  // distribute the elements into the buckets
  for (let i = 0; i < N; i++) {
    const number = array[i];
    const bucketIndex = Math.floor(number / (max + 1) * K);
    const bucket = buckets[bucketIndex];
    bucket.push(number);
    // visualize {
    arrayTracer.select(i);
    bucketsTracer.patch(bucketIndex, bucket.length - 1, number);
    Tracer.delay();
    bucketsTracer.depatch(bucketIndex, bucket.length - 1);
    // }

    // insertion sort within the bucket
    let j = bucket.length - 1;
    while (j > 0 && bucket[j - 1] > bucket[j]) {
      const temp = bucket[j - 1];
      bucket[j - 1] = bucket[j];
      bucket[j] = temp;
      // visualize {
      bucketsTracer.patch(bucketIndex, j - 1, bucket[j - 1]);
      bucketsTracer.patch(bucketIndex, j, bucket[j]);
      Tracer.delay();
      bucketsTracer.depatch(bucketIndex, j - 1);
      bucketsTracer.depatch(bucketIndex, j);
      // }
      j--;
    }
    // visualize {
    arrayTracer.deselect(i);
    // }
  }

  // concatenate the buckets back into the array
  let i = 0;
  for (let bucketIndex = 0; bucketIndex < K; bucketIndex++) {
    const bucket = buckets[bucketIndex];
    for (let j = 0; j < bucket.length; j++) {
      array[i] = bucket[j];
      // visualize {
      arrayTracer.patch(i, array[i]);
      bucketsTracer.select(bucketIndex, j);
      Tracer.delay();
      bucketsTracer.deselect(bucketIndex, j);
      arrayTracer.depatch(i);
      // }
      i++;
    }
  }
})();
