function BFSCheckBipartiteness(s) {
    var Q = [];

    // Create a new matrix to set colors (0,1)
    var Colors = [];
    for (var _i = 0; _i < G.length; _i++) Colors[_i] = -1;
    colorsTracer._setData(Colors);

    Colors[s] = 1;
    colorsTracer._notify(s, 1);

    Q.push(s); // add start node to queue

    while (Q.length > 0) {
        var node = Q.shift(); // dequeue
        tracer._visit(node)._wait();

        for (var i = 0; i < G[node].length; i++) {
        	if (G[node][i]) {

        		if (Colors[i] === -1) {

        			Colors[i] = 1 - Colors[node];
        			colorsTracer._notify(i, 1 - Colors[node]);

        			Q.push(i);
        			tracer._visit(i, node)._wait();

        		} else if (Colors[i] == Colors[node]) {
        			logger._print('Graph is not biparted');
        			return false;
        		}
        	}
        }
    }
    
    logger._print('Graph is biparted');
    return true;
}

BFSCheckBipartiteness(0);