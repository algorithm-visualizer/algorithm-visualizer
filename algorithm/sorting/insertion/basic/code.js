tracer._print('original array = [' + D.join(', ') + ']');
tracer._sleep(1000);
for (var i = 1; i < D.length; i++) {
    var key = D[i];
    tracer._print('insert ' + key);
    tracer._select(i);
    var j;
    for (j = i - 1; (j >= 0) && (D[j] > key); j--) {
        D[j + 1] = D[j];
        tracer._notify(j + 1);
    }
    D[j + 1] = key;
    tracer._notify(j + 1);
    tracer._deselect(i);
}
tracer._print('sorted array = [' + D.join(', ') + ']');