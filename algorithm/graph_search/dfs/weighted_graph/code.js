function DFS(node, parent, weight) { // node = current node, parent = previous node
    logger._next()._print((parent === undefined ? '' : parent) + ' -> ' + node);
    tracer._visit(node, parent, weight);
    D[node] = true; // label current node as discovered
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the edge from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node, weight + G[node][i]); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    logger._next()._print(node + ' <- ' + (parent === undefined ? '' : parent));
    tracer._leave(node, parent, 0);
}
var D; // D[i] indicates whether the i-th node is discovered or not
for (var i = 0; i < G.length; i++) { // start from every node
    logger._print('start from ' + i);
    D = [];
    for (var j = 0; j < G.length; j++) D.push(false);
    DFS(i, undefined, 0);
    tracer._clear();
}