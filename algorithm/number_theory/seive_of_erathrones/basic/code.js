logger._print("1 is not prime");
tracer._select(0)._wait();
for (var i = 2; i <= N; i++) {
  if (b[i] === 0) {
    logger._print(i + " is not marked, so it is prime");
    // a[i-1] is prime mark by red indicators
    tracer._notify(i - 1)._wait();
    for (var j = i + i; j <= N; j += i) {
      b[j] = 1; // a[j-1] is not prime, mark by blue indicators
      logger._print(j + " is a multiple of " + i + " so it is marked as composite");
      tracer._select(j - 1)._wait();
    }
    tracer._denotify(i - 1);
  }
}
logger._print("The unmarked numbers are the prime numbers from 1 to " + N);
