// This is a sample DLS applications where
// we try to find number of descendant of root within some depth
function DLSCount (limit, node, parent) { // node = current node, parent = previous node
    tracer._visit(node, parent)._wait();
    var child = 0;
    if (limit>0) { // cut off the search
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) { // if current node has the i-th node as a child
                child += 1 + DLSCount(limit-1, i, node); // recursively call DLS
            }
        }
        return child;
    }else{
      return child;
    }
}
logger._print('Number of descendant is ' + DLSCount(2,0));
