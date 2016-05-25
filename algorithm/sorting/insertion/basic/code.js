logger._print('original array = [' + D.join(', ') + ']');
for (var i = 1; i < D.length; i++) {
    var key = D[i];
    logger._print('insert ' + key);
    tracer._select(i)._wait();
    var j;
    for (j = i - 1; (j >= 0) && (D[j] > key); j--) {
        D[j + 1] = D[j];
        tracer._notify(j + 1, D[j + 1])._wait();
        tracer._denotify(j + 1);
    }
    D[j + 1] = key;
    tracer._notify(j + 1, D[j + 1])._wait();
    tracer._denotify(j + 1);
    tracer._deselect(i);
}
logger._print('sorted array = [' + D.join(', ') + ']');