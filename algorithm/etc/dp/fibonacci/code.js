for (var i = 2; i < index; i++) {
    D[i] = D[i - 2] + D[i - 1];
    tracer._select(i - 2, i - 1)._next();
    tracer._notify(i, D[i])._next();
    tracer._denotify(i);
    tracer._deselect(i - 2, i - 1);
}