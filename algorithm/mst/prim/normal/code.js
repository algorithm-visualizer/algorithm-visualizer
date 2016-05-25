function prim() {
    // Finds a tree so that there exists a path between
    // every two nodes while keeping the cost minimal
    var minD, minI, minJ, sum = 0, D = [];
    for (var i = 0; i < G.length; i++) D.push(0);
    D[0] = 1; // First node is visited
    for (var k = 0; k < G.length - 1; k++) { // Searching for k edges
        minD = Infinity;
        for (i = 0; i < G.length; i++)
            if (D[i]) // First node in an edge must be visited
                for (var j = 0; j < G.length; j++)
                    if (!D[j] && G[i][j]) {
                        tracer._visit(i, j)._wait();
                        // Second node must not be visited and must be connected to first node
                        if (G[i][j] < minD) {
                            // Searching for cheapest edge which satisfies requirements
                            minD = G[i][j];
                            minI = i;
                            minJ = j;
                        }
                        tracer._leave(i, j)._wait();
                    }
        tracer._visit(minI, minJ)._wait();
        D[minJ] = 1; // Visit second node and insert it into or tree
        sum += G[minI][minJ];
    }
    logger._print("The sum of all edges is: " + sum);
}

logger._print("nodes that belong to minimum spanning tree are: ");
prim();