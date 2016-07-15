function lcaBT (parent, root, a, b) {
    logger._print ('Beginning new Iteration of lcaBT () with parent: ' + parent + ', current root: ' + root);
    if (root === -1) {
        logger._print ('Reached end of path & target node(s) not found')
        return null;
    }
    
    if (parent !== null) treeTracer._visit (root, parent)._wait ();
    else treeTracer._visit (root)._wait ();
    
    if (root === a || root === b) return root;
    
    var left = lcaBT (root, T [root] [0], a, b);
    var right = lcaBT (root, T [root] [1], a, b);
    
    if (left !== null && right !== null) return root;
    if (left === null && right === null) {
        treeTracer._leave (root, parent)._wait ();
    }
    
    return (left !== null ? left : right);
}

var a = 7, b = 2;
logger._print ('Lowest common ancestor of ' + a + ' & ' + b + ' is: ' + lcaBT (null, 5, a, b));