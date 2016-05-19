function BFS(s) { // s = start node
    var Q = [];
    tracer._visit(s);
    Q.push(s); // add start node to queue
    while (Q.length > 0) {
        var node = Q.shift(); // dequeue
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) { // if current node has the i-th node as a child
                tracer._visit(i, node);
                Q.push(i); // add child node to queue
            }
        }
    }
}

BFS(0);