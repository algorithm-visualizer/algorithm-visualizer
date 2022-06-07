// import visualization libraries {
const { Tracer, Array1DTracer, GraphTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const T = {};

const elements = [5, 8, 10, 3, 1, 6, 9, 7, 2, 0, 4]; // item to be inserted

// define tracer variables {
const graphTracer = new GraphTracer(' BST - Elements marked red indicates the current status of tree ');
const elemTracer = new Array1DTracer(' Elements ');
const logger = new LogTracer(' Log ');
Layout.setRoot(new VerticalLayout([graphTracer, elemTracer, logger]));
elemTracer.set(elements);
graphTracer.log(logger);
Tracer.delay();
// }

function bstInsert(root, element, parent) { // root = current node , parent = previous node
  // visualize {
  graphTracer.visit(root, parent);
  Tracer.delay();
  // }
  const treeNode = T[root];
  let propName = '';
  if (element < root) {
    propName = 'left';
  } else if (element > root) {
    propName = 'right';
  }
  if (propName !== '') {
    if (!(propName in treeNode)) { // insert as left child of root
      treeNode[propName] = element;
      T[element] = {};
      // visualize {
      graphTracer.addNode(element);
      graphTracer.addEdge(root, element);
      graphTracer.select(element, root);
      Tracer.delay();
      graphTracer.deselect(element, root);
      logger.println(`${element} Inserted`);
      // }
    } else {
      bstInsert(treeNode[propName], element, root);
    }
  }
  // visualize {
  graphTracer.leave(root, parent);
  Tracer.delay();
  // }
}

const Root = elements[0]; // take first element as root
T[Root] = {};
// visualize {
graphTracer.addNode(Root);
graphTracer.layoutTree(Root, true);
logger.println(`${Root} Inserted as root of tree `);
// }

for (let i = 1; i < elements.length; i++) {
  // visualize {
  elemTracer.select(i);
  Tracer.delay();
  // }
  bstInsert(Root, elements[i]); // insert ith element
  // visualize {
  elemTracer.deselect(i);
  Tracer.delay();
  // }
}
