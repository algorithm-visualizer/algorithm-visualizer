for (var i = 2; i < index; i++) {
    D[i] = D[i - 2] + D[i - 1];
    tracer._selectSet([i - 2, i - 1]);
    tracer._notify(i);
    tracer._deselectSet([i - 2, i - 1]);
}