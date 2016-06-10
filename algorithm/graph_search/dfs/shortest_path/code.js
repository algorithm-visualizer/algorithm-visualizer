function DFS(node, parent, weight) { // node = current node, parent = previous node
    if (minWeight < weight) return;
    if (node === e) {
        tracer._visit(node, parent, weight)._wait();
        if (minWeight > weight) {
            minWeight = weight;
        }
        tracer._leave(node, parent, minWeight)._wait();
        return;
    }
    D[node] = true; // label current node as discovered
    tracer._visit(node, parent, weight)._wait();
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the path from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node, weight + G[node][i]); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    tracer._leave(node, parent, 0)._wait();
}
var s = Integer.random(0, G.length - 1); // s = start node
var e; // e = end node
do {
    e = Integer.random(0, G.length - 1);
} while (s === e);
var MAX_VALUE = Infinity;
var minWeight = MAX_VALUE;
logger._print('finding the shortest path from ' + s + ' to ' + e);
var D = []; // D[i] indicates whether the i-th node is discovered or not
for (var i = 0; i < G.length; i++) D.push(false);
DFS(s, undefined, 0);
if (minWeight === MAX_VALUE) {
    logger._print('there is no path from ' + s + ' to ' + e);
} else {
    logger._print('the shortest path from ' + s + ' to ' + e + ' is ' + minWeight);
}