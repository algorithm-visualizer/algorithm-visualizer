function BFS() {
    var W = []; // W[i] indicates the length of the shortest path from start node to the i-th node
    var Q = [];
    for (var i = 0; i < G.length; i++) {
        W.push(MAX_VALUE);
        tracer._weight(i, MAX_VALUE);
    }
    W[s] = 0;
    Q.push(s); // add start node to queue
    tracer._visit(s, undefined, 0);
    while (Q.length > 0) {
        var node = Q.shift(); // dequeue
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) { // if the edge from current node to the i-th node exists
                if (W[i] > W[node] + G[node][i]) { // if current path is shorter than the previously shortest path
                    W[i] = W[node] + G[node][i]; // update the length of the shortest path
                    Q.push(i); // add child node to queue
                    tracer._visit(i, node, W[i]);
                }
            }
        }
    }
    return W[e];
}
var s = Math.random() * G.length | 0; // s = start node
var e; // e = start node
do {
    e = Math.random() * G.length | 0;
} while (s == e);
var MAX_VALUE = Infinity;
tracer._pace(100);
tracer._print('finding the shortest path from ' + s + ' to ' + e);
tracer._sleep(1000);
var minWeight = BFS(s);
if (minWeight == MAX_VALUE) {
    tracer._print('there is no path from ' + s + ' to ' + e);
} else {
    tracer._print('the shortest path from ' + s + ' to ' + e + ' is ' + minWeight);
}