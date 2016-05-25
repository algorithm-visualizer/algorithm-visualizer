function DFS(node, parent) { // node = current node, parent = previous node
    tracer._visit(node, parent)._wait();
    D[node] = true; // label current node as discovered
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the edge from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    tracer._leave(node, parent)._wait();
}
var D; // D[i] indicates whether the i-th node is discovered or not
for (var i = 0; i < G.length; i++) { // start from every node
    D = [];
    for (var j = 0; j < G.length; j++) D.push(false);
    logger._print('start from ' + i);
    DFS(i);
    tracer._clear();
}