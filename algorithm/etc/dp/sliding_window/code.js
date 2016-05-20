tracer._pace(500);
var sum = D[0] + D[1] + D[2];
var max = sum;
tracer._print('sum = ' + sum, false);
tracer._selectSet([0, 1, 2]);
for (var i = 3; i < D.length; i++) {
    sum += D[i] - D[i - 3];
    if (max < sum) max = sum;
    tracer._print('sum = ' + sum, false);
    tracer._deselect(i - 3);
    tracer._select(i);
}
tracer._deselectSet([D.length - 3, D.length - 2, D.length - 1]);
tracer._print('max = ' + max);