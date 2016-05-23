function Dijkstra(start, end) {
    tracer._sleep();
    var MAX_VALUE = Infinity;
    var minIndex, minDistance;
    var S = []; // S[i] returns the distance from node v to node start
    var D = []; // D[i] indicates whether the i-th node is discovered or not
    for (var i = 0; i < G.length; i++) {
        D.push(false);
        S[i] = MAX_VALUE;
    }
    S[start] = 0; // Starting node is at distance 0 from itself
    var k = G.length;
    while (k--) {
        // Finding a node with the shortest distance from S[minIndex]
        minDistance = MAX_VALUE;
        for (i = 0; i < G.length; i++) {
            if (S[i] < minDistance && !D[i]) {
                minDistance = S[i];
                minIndex = i;
            }
        }
        if (minDistance == MAX_VALUE) break; // If there is no edge from current node, jump out of loop
        D[minIndex] = true;
        tracer._visit(minIndex);
        // For every unvisited neighbour of current node, we check
        // whether the path to it is shorter if going over the current node
        for (i = 0; i < G.length; i++) {
            if (G[minIndex][i] && S[i] > S[minIndex] + G[minIndex][i]) {
                S[i] = S[minIndex] + G[minIndex][i];
                tracer._visit(i, minIndex, S[i]);
                tracer._leave(i, minIndex, S[i]);
            }
        }
        tracer._leave(minIndex);
    }
    if (S[end] == MAX_VALUE) {
        tracer._print('there is no path from ' + start + ' to ' + end);
    } else {
        tracer._print('the shortest path from ' + start + ' to ' + end + ' is ' + S[end]);
    }
}

var s = Math.random() * G.length | 0; // s = start node
var e; // e = end node
do {
    e = Math.random() * G.length | 0;
} while (s == e);
tracer._pace(500);
tracer._print('finding the shortest path from ' + s + ' to ' + e);
Dijkstra(s, e);