// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, GraphTracer, LogTracer, Randomize, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

function filledArray(length, value) {
  return Array(...Array(length)).map(Number.prototype.valueOf, value);
}

// define tracer variables {
const G = Randomize.Graph({ N: 5, ratio: .4 });
let ranks;
const outgoingEdgeCounts = filledArray(G.length, 0);
let incomingNodes;
const graphTracer = new GraphTracer('Web Page inter-connections');
const rankTracer = new Array1DTracer('Web Page Ranks');
const oecTracer = new Array1DTracer('Outgoing Edge Counts');
const inTracer = new Array2DTracer('Incoming Nodes');

const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([graphTracer, rankTracer, oecTracer, inTracer, logger]));

graphTracer.set(G);
oecTracer.set(outgoingEdgeCounts);

for (incomingNodes = []; incomingNodes.length < G.length; incomingNodes.push(filledArray(G.length, -1))) ;
inTracer.set(incomingNodes);
Tracer.delay();
// }

/*
  PageRank Algorithm Version 2
  Equation:
    PR (X) = ( (1 - D)/N ) + D (Summation i->X (PR (I) / Out (i)))
  NOTE: Algorithm uses the recommended damping factor (D). Number of iterations is small because only a small Web of 5 Pages is simulated
*/

function arraySum(array) {
  return array.reduce(
    (sum, curr) =>
      sum + (curr ? 1 : 0) // if curr is 0 (no edge) or undefined (loop not allowed), sum remains unchanged
    , 0,
  );
}

function showOutgoingEdges(i) {
  G[i].forEach((edgeExists, j) => {
    if (edgeExists) {
      // visualize {
      graphTracer.visit(j, i);
      Tracer.delay();
      graphTracer.leave(j, i);
      Tracer.delay();
      // }
    }
  });
}

// PRECOMPUTATIONS

// logger {
logger.println('Calculate Outgoing Edge Count for each Node');
// }
(function calculateOEC() {
  G.forEach((relations, i) => {
    outgoingEdgeCounts[i] = arraySum(relations);
    showOutgoingEdges(i);

    // visualize {
    oecTracer.patch(i, outgoingEdgeCounts[i]);
    Tracer.delay();
    oecTracer.depatch(i);
    Tracer.delay();
    // }
  });
}());

// logger {
logger.println('determine incoming nodes for each node');
// }
(function determineIN() {
  for (let i = 0; i < G.length; i++) {
    for (let j = 0; j < G.length; j++) {
      if (G[i][j]) {
        // there's an edge FROM i TO j
        // visualize {
        graphTracer.visit(j, i);
        Tracer.delay();
        // }

        const nextPos = incomingNodes[j].indexOf(-1);
        incomingNodes[j][nextPos] = i;
        // visualize {
        inTracer.patch(j, nextPos, i);
        Tracer.delay();
        inTracer.depatch(j, nextPos);
        Tracer.delay();

        graphTracer.leave(j, i);
        Tracer.delay();
        // }
      }
    }
  }

  // logger.println ('All -1s will be removed from incoming node records, they are irrelevant');
  incomingNodes.forEach((arr) => {
    arr.splice(arr.indexOf(-1));
  });
}());

function updateRank(nodeIndex) {
  let inNodeSummation = 0;
  let result;

  // logger {
  logger.println(`Updating rank of ${nodeIndex}`);
  logger.println(`The incoming Nodes of ${nodeIndex} are being highlighted`);
  // }

  incomingNodes[nodeIndex].forEach((incoming, i) => {
    // visualize {
    inTracer.select(nodeIndex, i);
    Tracer.delay();
    logger.println(`Outgoing edge count of ${incoming} is ${outgoingEdgeCounts[incoming]}`);
    oecTracer.select(incoming);
    Tracer.delay();
    // }

    inNodeSummation += (ranks[incoming] / outgoingEdgeCounts[incoming]);

    // visualize {
    oecTracer.deselect(incoming);
    Tracer.delay();
    inTracer.deselect(nodeIndex, i);
    Tracer.delay();
    // }
  });
  // logger {
  logger.println(`In-Node summation of ${nodeIndex} = ${inNodeSummation}`);
  // }
  
  result = ((1 - damping) / G.length) + (damping * inNodeSummation); // notice the subtle difference between equations of Basic PR & PR version 2 (divide by N)
  // logger {
  logger.println(`Therefore, using Equation, new rank of ${nodeIndex} = ${result}`);
  // }
  return result;
}

let damping = 0.85;
let iterations = 7;
const initialRank = 1.0;

// logger {
logger.println(`Initialized all Page ranks to ${initialRank}`);
// }
ranks = filledArray(G.length, initialRank);

// visualize {
rankTracer.set(ranks);
// }
// logger {
logger.println('Begin execution of PageRank Version #1');
logger.println('Equation used: PR (X) = (1 - D) + D (In-Node-Summation i->X (PR (I) / Out (i)))');
logger.println('D = Damping Factor, PR (X) = Page rank of Node X, i = the ith In-Node of X, Out (i) = outgoing Edge Count of i');
logger.println('');
// }

while (iterations--) {
  for (let node = 0; node < ranks.length; node++) {
    ranks[node] = updateRank(node);
    // visualize {
    rankTracer.patch(node, ranks[node]);
    Tracer.delay();
    rankTracer.patch(node);
    Tracer.delay();
    // }
  }
}

// logger {
logger.println('Page Ranks have been converged to.');
ranks.forEach((rank, node) => {
  logger.println(`Rank of Node #${node} = ${rank}`);
});
logger.println('Done');
// }
