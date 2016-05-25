logger._print('original array = [' + D.join(', ') + ']');
for (var i = 0; i < D.length - 1; i++) {
    var minJ = i;
    tracer._select(i)._wait();
    for (var j = i + 1; j < D.length; j++) {
    	tracer._select(j)._wait();
        if (D[j] < D[minJ]) {
            minJ = j;
            tracer._notify(j)._wait();
            tracer._denotify(j);
        }
        tracer._deselect(j);
    }
    if (minJ != i) {
        logger._print('swap ' + D[i] + ' and ' + D[minJ]);
        var temp = D[i];
        D[i] = D[minJ];
        D[minJ] = temp;
        tracer._notify(i, D[i])._notify(minJ, D[minJ])._wait();
        tracer._denotify(i)._denotify(minJ);
    }
    tracer._deselect(i);
}
logger._print('sorted array = [' + D.join(', ') + ']');