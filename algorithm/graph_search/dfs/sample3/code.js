var D; // D[i] indicates whether the i-th node is discovered or not
var W; // W[i] indicates the weight of the i-th node

function getWeight(v, p) {
    if (p === undefined) return 0;
    return W[p] + G[p][v]; // the sum of the weights of previous node and the path
}

function DFS(node, parent) { // node = current node, parent = previous node
    D[node] = true; // label current node as discovered
    W[node] = getWeight(node, parent); // update the weight of the node
    tracer._visit(node, parent, W[node]);
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the path from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    W[node] = 0; // reset the weight of the node
    tracer._leave(node, parent, W[node]);
}

tracer._pace(1000);
for (var i = 0; i < G.length; i++) { // start from every node
    tracer._print('start from ' + i);
    D = [];
    W = [];
    for (var j = 0; j < G.length; j++) {
        D[j] = false;
        W[j] = 0;
    }
    DFS(i);
    tracer._clear();
}