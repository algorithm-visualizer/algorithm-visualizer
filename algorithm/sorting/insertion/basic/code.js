for (var j = 1; j < D.length; j++) {
    var key = D[j];
    tracer._select(j);
    for (var i = j - 1; (i >= 0) && (D[i] < key); i--) {
        D[i + 1] = D[i];
    }
    D[i + 1] = key;
    tracer._change(j);
}