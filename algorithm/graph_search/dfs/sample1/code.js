var D; // D[i] indicates whether the i-th node is discovered or not

function DFS(v, p) { // v = current node, p = previous node
    tracer.visit(v, p);
    D[v] = true; // label v as discovered
    G[v].forEach(function (w) { // G[v] contains edges starting from v
        if (!D[w]) { // if w is not labeled as discovered
            DFS(w, v); // recursively call DFS
        }
    });
    tracer.leave(v, p);
}

for (var i = 0; i < G.length; i++) { // start from every node
    tracer.print('start from ' + i);
    D = new Array(G.length);
    DFS(i);
    tracer.clear();
}