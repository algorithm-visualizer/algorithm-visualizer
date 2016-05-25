logger._print('Original array = [' + D.join(', ') + ']');
var N = D.length;

for (var gap = N; gap = parseInt(gap / 2);) {
    logger._print('');
    logger._print('Gap of ' + gap);
    for (var i = gap; i < N; i++) {
        tracer._select(i)._select(i - gap)._wait();
        var k = D[i];
        for (var j = i; j >= gap && k < D[j - gap]; j -= gap) {
            logger._print('Swap ' + D[j] + ' and ' + D[j - gap]);
            tracer._notify(j, D[j])._notify(j - gap, D[j - gap])._wait();
            D[j] = D[j - gap];
            tracer._denotify(i - 1)._denotify(i);
        }
        D[j] = k;
        tracer._notify(j,D[j]);
        tracer._denotify(j);
        tracer._deselect(i)._deselect(i - gap);
    }
}
tracer._clear();
logger._print('')
logger._print('Sorted array = [' + D.join(', ') + ']');
