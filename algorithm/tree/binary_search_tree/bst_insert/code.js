function bst_insert ( root, element, parent ) { // root = current node , parent = previous node
    tracer._visit ( root, parent )._wait ();
    var treeNode = T[root];
    var propName = '';    
    if ( element < root ) {
        propName = 'left';
    } else if ( element > root) {
        propName = 'right';
    }
    if(propName !== '') {
        if ( !treeNode.hasOwnProperty(propName) ) {  // insert as left child of root
            treeNode[propName] = element;
            T[element] = {};
            tracer._addNode(element, root)._wait();
            logger._print( element + ' Inserted ');
        } else {
            bst_insert ( treeNode[propName], element, root );
        }
    }
}

var Root = elements[0]; // take first element as root
T[Root] = {};
tracer._addRoot(Root);
logger._print ( Root + ' Inserted as root of tree ');

for (var i = 1; i < elements.length; i++) {
    tracer2._select ( i )._wait();
    bst_insert ( Root, elements[i] ); // insert ith element
    tracer2._deselect( i )._wait();
    tracer._clearTraversal();
}
