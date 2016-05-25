logger._print('original array = [' + D[0].join(', ') + ']');
function pow(base, expo) {
    var ans = 1;
    for (var i = 0; i < expo; i++) {
        ans *= base;
    }
    return ans;
}
function digit(i, exp) {
    return parseInt(D[0][i] / pow(10, exp) % 10);
}
for (var exp = 0; exp < 3; exp++) {
    logger._print("Digit: " + exp);
    var i;
    for (i = 0; i < D[0].length; i++) {
        var d = digit(i, exp);
        tracer._select(0, i)._wait();
        D[2][d] += 1;
        tracer._notify(2, d, D[2][d])._wait();
        tracer._denotify(2, d);
        tracer._deselect(0, i);
    }
    for (i = 1; i < 10; i++) {
        tracer._select(2, i - 1)._wait();
        D[2][i] += D[2][i - 1];
        tracer._notify(2, i, D[2][i])._wait();
        tracer._denotify(2, i);
        tracer._deselect(2, i - 1);
    }
    for (i = D[0].length - 1; i >= 0; i--) {
        var d = digit(i, exp);
        tracer._select(0, i)._wait();
        D[2][d] -= 1;
        tracer._notify(2, d, D[2][d])._wait();
        tracer._denotify(2, d);
        D[1][D[2][d]] = D[0][i];
        tracer._notify(1, D[2][d], D[1][D[2][d]])._wait();
        tracer._denotify(1, D[2][d]);
        tracer._deselect(0, i);
    }
    for (i = 0; i < D[0].length; i++) {
        tracer._select(1, i)._wait();
        D[0][i] = D[1][i];
        tracer._notify(0, i, D[0][i])._wait();
        tracer._denotify(0, i);
        tracer._deselect(1, i);
    }
    for (i = 0; i < 10; i++) {
        D[2][i] = 0;
        tracer._notify(2, i, D[2][i])._wait();
        tracer._denotify(2, i);
    }
}
logger._print('sorted array = [' + D[0].join(', ') + ']');
