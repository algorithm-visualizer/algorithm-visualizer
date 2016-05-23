function DFS(node, parent, weight) { // node = current node, parent = previous node
    if (minWeight < weight) return;
    if (node == e) {
        tracer._visit(node, parent, weight);
        tracer._leave(node, parent, 0);
        if (minWeight > weight) {
            minWeight = weight;
        }
        return;
    }
    D[node] = true; // label current node as discovered
    tracer._visit(node, parent, weight);
    for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) { // if the path from current node to the i-th node exists
            if (!D[i]) { // if the i-th node is not labeled as discovered
                DFS(i, node, weight + G[node][i]); // recursively call DFS
            }
        }
    }
    D[node] = false; // label current node as undiscovered
    tracer._leave(node, parent, 0);
}
var s = Math.random() * G.length | 0; // s = start node
var e; // e = end node
do {
    e = Math.random() * G.length | 0;
} while (s == e);
var MAX_VALUE = Infinity;
var minWeight = MAX_VALUE;
tracer._pace(100);
tracer._print('finding the shortest path from ' + s + ' to ' + e);
tracer._sleep(1000);
var D = []; // D[i] indicates whether the i-th node is discovered or not
for (var i = 0; i < G.length; i++) D.push(false);
DFS(s, undefined, 0);
if (minWeight == MAX_VALUE) {
    tracer._print('there is no path from ' + s + ' to ' + e);
} else {
    tracer._print('the shortest path from ' + s + ' to ' + e + ' is ' + minWeight);
}