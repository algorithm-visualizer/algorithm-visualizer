logger._print('original array = [' + D.join(', ') + ']');
var N = D.length;
var swapped;
do {
    swapped = false;
    tracer._select(N - 1)._wait();
    for (var i = 1; i < N; i++) {
        tracer._select(i)._wait();
        if (D[i - 1] > D[i]) {
            logger._print('swap ' + D[i - 1] + ' and ' + D[i]);
            var temp = D[i - 1];
            D[i - 1] = D[i];
            D[i] = temp;
            swapped = true;
            tracer._notify(i - 1, D[i - 1])._notify(i, D[i])._wait();
            tracer._denotify(i - 1)._denotify(i);
        }
        tracer._deselect(i);
    }
    tracer._deselect(N - 1);
    N--;
} while (swapped);
logger._print('sorted array = [' + D.join(', ') + ']');