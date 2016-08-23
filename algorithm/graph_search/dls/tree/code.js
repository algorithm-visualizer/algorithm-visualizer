// This is a sample DLS where
// we try to find number of descendant of root within some depth
function DLS (limit, node, parent) { // node = current node, parent = previous node
    tracer._visit(node, parent)._wait();
    if (limit>0) { // cut off the search
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) { // if current node has the i-th node as a child
                DLS(limit-1, i, node); // recursively call DLS
            }
        }
    }
}
DLS(2,0);
