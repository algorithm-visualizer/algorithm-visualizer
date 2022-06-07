// import visualization libraries {
const { Tracer, Array2DTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const gridSize = 10;
const generations = 4;
const fillChance = 0.55;

const G = [];
const nextG = [];
for (let i = 0; i < gridSize; i++) {
  G[i] = [];
  nextG[i] = [];
  for (let j = 0; j < gridSize; j++) {
    if (Math.random() < fillChance || i === 0 || j === 0 || i === gridSize - 1 || j === gridSize - 1) {
      G[i][j] = '#';
    } else {
      G[i][j] = '.';
    }
    nextG[i][j] = '#';
  }
}

// define tracer variables {
const tracer = new Array2DTracer();
Layout.setRoot(new VerticalLayout([tracer]));
tracer.set(G);
Tracer.delay();
// }

// visualize {
for (let gi = 0; gi < G.length; gi++) {
  for (let gj = 0; gj < G[gi].length; gj++) {
    if (G[gi][gj] === '#') {
      tracer.patch(gi, gj, G[gi][gj]);
    }
  }
}
// }

function CellularAutomata(fillShape, emptyShape) {
  const nextGrid = [];

  for (let i = 0; i < G.length; i++) {
    nextGrid[i] = [];
    for (let j = 0; j < G[i].length; j++) {
      let adjCount = 0;
      let twoAwayCount = 0;
      // look at the states of the neighboring cells
      for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
          if ((i + x >= 0 && i + x < G.length) && (j + y >= 0 && j + y < G[i].length)) {
            if (!(x !== 0 && y !== 0) && G[i + x][j + y] === emptyShape) {
              if (x === -2 || x === 2 || y === -2 || y === 2) {
                twoAwayCount++;
              } else {
                adjCount++;
              }
            }
          }
        }
      }
      // change the current cell's state according to these rules
      if ((adjCount >= 5)) {
        nextGrid[i][j] = fillShape;
      } else if (adjCount <= 1) {
        if (twoAwayCount < 3) {
          nextGrid[i][j] = fillShape;
        } else {
          nextGrid[i][j] = emptyShape;
        }
      } else {
        nextGrid[i][j] = emptyShape;
      }
    }
  }

  for (let i = 0; i < nextGrid.length; i++) {
    for (let j = 0; j < nextGrid[i].length; j++) {
      // visualize {
      tracer.depatch(i, j, G[i][j]);
      tracer.select(i, j);
      Tracer.delay();
      // }
      G[i][j] = nextGrid[i][j];
      // visualize {
      if (G[i][j] === fillShape) {
        tracer.patch(i, j, G[i][j]);
      } else {
        tracer.patch(i, j, G[i][j]);
        tracer.depatch(i, j, G[i][j]);
        tracer.deselect(i, j);
      }
      // }
    }
  }
}

for (let iter = 0; iter < generations; iter++) {
  CellularAutomata('#', '.');
}
