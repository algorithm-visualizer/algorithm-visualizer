tracer._print('original array = [' + D.join(', ') + ']');
tracer._sleep(1000);
tracer._pace(500);
for (var i = 0; i < D.length - 1; i++) {
    var minJ = i;
    tracer._select(i);
    for (var j = i + 1; j < D.length; j++) {
        if (D[j] < D[minJ]) {
            tracer._select(j);
            minJ = j;
            tracer._deselect(j);
        }
    }
    if (minJ != i) {
        tracer._print('swap ' + D[i] + ' and ' + D[minJ]);
        var temp = D[i];
        D[i] = D[minJ];
        D[minJ] = temp;
        tracer._notify(i, minJ);
    }
    tracer._deselect(i);
}
tracer._print('sorted array = [' + D.join(', ') + ']');