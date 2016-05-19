function DFS(node, parent) { // node = current node, parent = previous node
    D[node] = true; // label current node as discovered
    tracer._visit(node, parent);
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the edge from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    tracer._leave(node, parent);
}

var D; // D[i] indicates whether the i-th node is discovered or not
for (var i = 0; i < G.length; i++) { // start from every node
    tracer._print('start from ' + i);
    D = [];
    for (var j = 0; j < G.length; j++) D.push(false);
    DFS(i);
    tracer._clear();
}