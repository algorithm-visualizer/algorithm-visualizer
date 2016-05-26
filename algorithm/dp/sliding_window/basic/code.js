var sum = D[0] + D[1] + D[2];
var max = sum;
tracer._select(0, 2);
logger._print('sum = ' + sum)._wait();
for (var i = 3; i < D.length; i++) {
    sum += D[i] - D[i - 3];
    if (max < sum) max = sum;
    tracer._deselect(i - 3);
    tracer._select(i);
    logger._print('sum = ' + sum)._wait();
}
tracer._deselect(D.length - 3, D.length - 1);
logger._print('max = ' + max);