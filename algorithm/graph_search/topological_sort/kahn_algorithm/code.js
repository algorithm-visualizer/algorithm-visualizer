(function topologicalSort() {
    var inDegrees = Array.apply(null, Array(G.length)).map(Number.prototype.valueOf, 0);		//create an Array of G.length number of 0s
    var Q = [], iter = 0, i;

    logger._print('Calculating in-degrees for each Node...');
    for (var currNode = 0; currNode < G.length; currNode++) {
        for (var currNodeNeighbor = 0; currNodeNeighbor < G.length; currNodeNeighbor++) {
            if (G [currNode] [currNodeNeighbor]) {
                logger._print(currNodeNeighbor + ' has an incoming edge from ' + currNode);
                tracer._visit(currNodeNeighbor, currNode)._wait();
                inDegrees [currNodeNeighbor]++;
                tracer._leave(currNodeNeighbor, currNode)._wait();
            }
        }
    }
    logger._print('Done. In-Degrees are: [ ' + String(inDegrees) + ' ]');
    logger._print('');

    logger._print('Initializing queue with all the sources (nodes with no incoming edges)');
    inDegrees.map(function (indegrees, node) {
        tracer._visit(node)._wait();
        if (!indegrees) {
            logger._print(node + ' is a source');
            Q.push(node);
        }
        tracer._leave(node)._wait();
    });
    logger._print('Done. Initial State of Queue: [ ' + String(Q) + ' ]');
    logger._print('');

    //begin topological sort (kahn)
    while (Q.length > 0) {
        logger._print('Iteration #' + iter + '. Queue state: [ ' + String(Q) + ' ]');
        currNode = Q.shift();
        tracer._visit(currNode)._wait();

        for (i = 0; i < G.length; i++) {
            if (G [currNode] [i]) {
                logger._print(i + ' has an incoming edge from ' + currNode + '. Decrementing ' + i + '\'s in-degree by 1.');
                tracer._visit(i, currNode)._wait();
                inDegrees [i]--;
                tracer._leave(i, currNode)._wait();

                if (!inDegrees [i]) {
                    logger._print(i + '\'s in-degree is now 0. Enqueuing ' + i);
                    Q.push(i);
                }
            }
        }
        tracer._leave(currNode)._wait();
        logger._print('In-degrees are: [' + String(inDegrees) + ' ]');
        logger._print('-------------------------------------------------------------------');

        iter++;
    }
})();