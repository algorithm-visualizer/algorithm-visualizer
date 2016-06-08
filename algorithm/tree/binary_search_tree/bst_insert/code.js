function bst_insert ( root, element, parent ) { // node = current node , parent = previous node
    tracer._visit ( root, parent )._wait ();
    if ( element < root ) {
        if ( T[root][0] === -1 ) {  // insert as left child of root
            T[root][0] = element;
            G[root][element] = 1; // update in graph
            tracer._visit ( element, root )._wait ();
            logger._print( element + ' Inserted ');
        } else {
            //tracer._clear ();
            bst_insert ( T[root][0], element, root );
        }
    } else if ( element > root ) { // insert as right child of root
        if( T[root][1] === -1 ) {
            T[root][1] = element;
            G[root][element] = 1; // update in graph
            tracer._visit ( element, root )._wait ();
            logger._print ( element + ' Inserted ');
        } else {
            //tracer._clear ();
            bst_insert ( T[root][1], element, root );
        }
    }
}

var Root = elements[0]; // take first element as root
logger._print ( Root + ' Inserted as root of tree ');
tracer._setTreeData ( G, Root );

for (var i = 1; i < elements.length; i++) {
    tracer2._select ( i )._wait();
    bst_insert ( Root, elements[i] ); // insert ith element
    tracer2._deselect( i );
}
