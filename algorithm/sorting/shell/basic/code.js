logger._print('Original array = [' + D.join(', ') + ']');
var N = D.length;

for (var gap = N; gap = parseInt(gap / 2);) {
    logger._print('');
    logger._print('Gap of ' + gap);
    for (var i = gap; i < N; i++) {
        tracer._select(i)._select(i - gap)._wait();
        var k = D[i];
        logger._print('Holding: ' + k)
        for (var j = i; j >= gap && k < D[j - gap]; j -= gap) {
            logger._print(k + ' < ' + D[j - gap]);
            D[j] = D[j - gap];
            tracer._notify(j, D[j])._wait();
            tracer._denotify(j);
        }
        var old = D[j];
        D[j] = k;
        if (old != k) {
            tracer._notify(j,D[j])._wait();
            tracer._denotify(j);
            logger._print('Swapped ' + D[j] + ' with ' + old);
        }

        tracer._deselect(i)._deselect(i - gap);
    }
}
tracer._clear();
logger._print('')
logger._print('Sorted array = [' + D.join(', ') + ']');
