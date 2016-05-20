tracer._print('original array = [' + D.join(', ') + ']');
tracer._sleep(1000);
tracer._pace(300);
var N = D.length;
var swapped;
do {
    swapped = false;
    tracer._select(N - 1);
    for (var i = 1; i < N; i++) {
        if (D[i - 1] > D[i]) {
            tracer._print('swap ' + D[i - 1] + ' and ' + D[i]);
            var temp = D[i - 1];
            D[i - 1] = D[i];
            D[i] = temp;
            swapped = true;
            tracer._notify(i - 1, i);
        }
    }
    tracer._deselect(N - 1);
    N--;
} while (swapped);
tracer._print('sorted array = [' + D.join(', ') + ']');