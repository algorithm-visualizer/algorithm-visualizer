function bst(item, node, parent) { // node = current node , parent = previous node
  tracer._visit(node, parent)._wait();
  if (item === node) { 			// key found
    logger._print(' Match Found ');
  } else if (item < node) { 	// key less than value of current node
    if (T[node][0] === -1) {
      logger._print(' Not Found ');
    } else {
      bst(item, T[node][0], node);
    }
  } else {						// key greater than value of current node
    if (T[node][1] === -1) {
      logger._print(' Not Found ');
    } else {
      bst(item, T[node][1], node);
    }
  }
}

logger._print('Finding number ' + key);
bst(key, 5); // node with key 5 is the root