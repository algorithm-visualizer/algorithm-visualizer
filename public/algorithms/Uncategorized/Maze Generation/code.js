// import visualization libraries {
const { Tracer, Array2DTracer, LogTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }

const n = 6; // rows (change these!)
const m = 6; // columns (change these!)

const hEnd = m * 4 - (m - 1);
const vEnd = n * 3 - (n - 1);

const G = [];

for (let i = 0; i < vEnd; i++) { // by row
  G[i] = new Array(hEnd);
  for (let j = 0; j < hEnd; j++) { // by column
    G[i][j] = ' ';

    if (i === 0 && j === 0) { // top-left corner
      G[i][j] = '┌';
    } else if (i === 0 && j === hEnd - 1) { // top-right corner
      G[i][j] = '┐';
    } else if (i === vEnd - 1 && j === 0) { // bottom-left corner
      G[i][j] = '└';
    } else if (i === vEnd - 1 && j === hEnd - 1) { // bottom-right corner
      G[i][j] = '┘';
    } else if ((j % 3 === 0) && (i % vEnd !== 0 && i !== vEnd - 1 && i % 2 === 1)) {
      G[i][j] = '│';
    } else if (i % 2 === 0) {
      G[i][j] = '─';
    }

    if (m > 1) { // More than one column
      if (j % 3 === 0 && j !== 0 && j !== hEnd - 1 && i === 0) {
        G[i][j] = '┬';
      }
      if (j % 3 === 0 && j !== 0 && j !== hEnd - 1 && i === vEnd - 1) {
        G[i][j] = '┴';
      }
    }

    if (n > 1) { // More than one row
      if (i % 2 === 0 && i !== 0 && i !== vEnd - 1 && j === 0) {
        G[i][j] = '├';
      }
      if (i % 2 === 0 && i !== 0 && i !== vEnd - 1 && j === hEnd - 1) {
        G[i][j] = '┤';
      }
    }

    if (n > 1 && m > 1) { // More than one row and column
      if (i % 2 === 0 && j % 3 === 0 && i !== 0 && j !== 0 && i !== vEnd - 1 && j !== hEnd - 1) {
        G[i][j] = '┼';
      }
    }
  }
}

// define tracer variables {
const tracer = new Array2DTracer();
const logger = new LogTracer();
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set(G);
Tracer.delay();
// }

function buildMaze() {
  const mySet = new disjointSet();
  const width = m;
  const height = n;
  let setSize = 0;
  const graph = [];
  const visitedMap = {};
  const walls = {};
  const rightWalls = [];
  const downWalls = [];
  let location = 0;

  mySet.addElements(width * height);

  // logger {
  logger.println('initializing grid (all walls are up)');
  // }
  // init 'graph'
  // each room has two walls, a down and right wall.
  for (let i = 0; i < width; i++) {
    graph[i] = new Array(height);
    for (let j = 0; j < height; j++) {
      graph[i][j] = location;

      walls[location] = { down: true, right: true };
      visitedMap[location] = false;

      // If you can label the rooms with just 2 digits
      if (width * height < 100) {
        const locationString = location.toString();

        G[j * 2 + 1][i * 3 + 1] = locationString[0];
        G[j * 2 + 1][i * 3 + 2] = locationString[1];

        // visualize {
        tracer.set(G);
        // }
      }

      rightWalls.push({ x: i, y: j });
      downWalls.push({ x: i, y: j });
      location++;
    }
  }

  // logger {
  logger.println('shuffled the walls for random selection');
  // }
  // Randomly shuffle the walls
  shuffle(rightWalls);
  shuffle(downWalls);

  // Picking random walls to remove
  while (setSize !== mySet.elements - 1) {
    const randomWall = Math.floor((Math.random() * 2) + 1);
    if (randomWall === 1 && downWalls.length > 0) {
      // Down wall
      const currentRoom = downWalls.pop();
      const iX = currentRoom.x;
      const iY = currentRoom.y;
      const iYdown = iY + 1;
      if (iYdown < height) {
        const u = graph[iX][iY];
        const v = graph[iX][iYdown];
        // visualize {
        tracer.patch(iY * 2 + 1, iX * 3 + 1);
        tracer.patch(iY * 2 + 1, iX * 3 + 2);
        tracer.patch(iYdown * 2 + 1, iX * 3 + 1);
        tracer.patch(iYdown * 2 + 1, iX * 3 + 2);
        // }
        if (mySet.find(u) !== mySet.find(v)) {
          // logger {
          logger.println(`Rooms: ${u} & ${v} now belong to the same set, delete wall between them`);

          Tracer.delay();
          // }
          mySet.setUnion(u, v);
          setSize++;
          // delete wall
          walls[u].down = false;
        } else {
          // logger {
          logger.println(`Rooms: ${u} & ${v} would create a cycle! This is not good!`);
          Tracer.delay();
          // }
        }
        // visualize {
        tracer.depatch(iY * 2 + 1, iX * 3 + 1);
        tracer.depatch(iY * 2 + 1, iX * 3 + 2);
        tracer.depatch(iYdown * 2 + 1, iX * 3 + 1);
        tracer.depatch(iYdown * 2 + 1, iX * 3 + 2);
        // }
      }
    } else if (randomWall === 2 && rightWalls.length > 0) {
      // Right Wall
      const currentRoom = rightWalls.pop();
      const iX = currentRoom.x;
      const iY = currentRoom.y;
      const iXright = iX + 1;
      if (iXright < width) {
        const u = graph[iX][iY];
        const v = graph[iXright][iY];
        // visualize {
        tracer.patch(iY * 2 + 1, iX * 3 + 1);
        tracer.patch(iY * 2 + 1, iX * 3 + 2);
        tracer.patch(iY * 2 + 1, iXright * 3 + 1);
        tracer.patch(iY * 2 + 1, iXright * 3 + 2);
        // }
        if (mySet.find(u) !== mySet.find(v)) {
          // logger {
          logger.println(`Rooms: ${u} & ${v} now belong to the same set, delete wall between them`);

          Tracer.delay();
          // }
          mySet.setUnion(u, v);
          setSize++;
          // delete wall
          walls[u].right = false;
        } else {
          // logger {
          logger.println(`Rooms: ${u} & ${v} would create a cycle! This is not good!`);
          Tracer.delay();
          // }
        }
        // visualize {
        tracer.depatch(iY * 2 + 1, iX * 3 + 1);
        tracer.depatch(iY * 2 + 1, iX * 3 + 2);
        tracer.depatch(iY * 2 + 1, iXright * 3 + 1);
        tracer.depatch(iY * 2 + 1, iXright * 3 + 2);
        // }
      }
    }
  }

  // logger {
  logger.println('deleting the walls');
  // }
  // update deleted walls
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const currentWall = walls[graph[i][j]];

      if (currentWall.down === false) {
        G[j * 2 + 2][i * 3 + 1] = ' ';
        G[j * 2 + 2][i * 3 + 2] = ' ';
        // visualize {
        tracer.select(j * 2 + 2, i * 3 + 1);
        Tracer.delay();
        tracer.select(j * 2 + 2, i * 3 + 2);
        Tracer.delay();
        // }
      }

      if (currentWall.right === false) {
        G[j * 2 + 1][i * 3 + 3] = ' ';
        // visualize {
        tracer.select(j * 2 + 1, i * 3 + 3);
        Tracer.delay();
        // }
      }
      // visualize {
      tracer.set(G);
      // }
    }
  }
  // logger {
  logger.println('cleaning up the grid!');
  // }
  cleanUpGrid(width, height);

  // Clear out walls for the start and end locations.
  const randomStart = Math.floor(Math.random() * width);
  const randomEnd = Math.floor(Math.random() * width);

  // logger {
  logger.println('setting the Start (S) & End (E) locations');
  // }

  // Start Location
  G[0][randomStart * 3 + 1] = ' ';
  G[0][randomStart * 3 + 2] = ' ';
  G[1][randomStart * 3 + 1] = 'S';

  // End Location
  G[vEnd - 1][randomEnd * 3 + 1] = ' ';
  G[vEnd - 1][randomEnd * 3 + 2] = ' ';
  G[vEnd - 2][randomEnd * 3 + 1] = 'E';

  cleanUpStartLocation(randomStart);
  cleanUpEndLocation(randomEnd);

  // logger {
  logger.println('maze is completed!');
  // }

  // set the data
  // visualize {
  tracer.set(G);
  // }
}

function cleanUpStartLocation(start) {
  if (G[0][start * 3] === '┬' && G[1][start * 3] === '│') {
    G[0][start * 3] = '┐';
  }
  if (G[0][start * 3 + 3] === '┬' && G[1][start * 3 + 3] === '│') {
    G[0][start * 3 + 3] = '┌';
  }
  if (G[0][start * 3] === '┌') {
    G[0][start * 3] = '│';
  }
  if (G[0][start * 3 + 3] === '┐') {
    G[0][start * 3 + 3] = '│';
  }
}

function cleanUpEndLocation(end) {
  if (G[vEnd - 1][end * 3] === '┴' && G[vEnd - 2][end * 3] === '│') {
    G[vEnd - 1][end * 3] = '┘';
  }
  if (G[vEnd - 1][end * 3 + 3] === '┴' && G[vEnd - 2][end * 3 + 3] === '│') {
    G[vEnd - 1][end * 3 + 3] = '└';
  }
  if (G[vEnd - 1][end * 3] === '└') {
    G[vEnd - 1][end * 3] = '│';
  }
  if (G[vEnd - 1][end * 3 + 3] === '┘') {
    G[vEnd - 1][end * 3 + 3] = '│';
  }
}

function cleanUpGrid(width, height) {
  // Remove room numbers
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      G[j * 2 + 1][i * 3 + 1] = ' ';
      G[j * 2 + 1][i * 3 + 2] = ' ';
    }
  }

  // clean up grid for looks
  for (let i = 0; i < vEnd; i++) {
    for (let j = 0; j < hEnd; j++) {
      if (G[i][j] === '├') {
        if (G[i][j + 1] === ' ') {
          G[i][j] = '│';
        }
      }

      if (G[i][j] === '┤') {
        if (G[i][j - 1] === ' ') {
          G[i][j] = '│';
        }
      }

      if (G[i][j] === '┬') {
        if (G[i + 1][j] === ' ') {
          G[i][j] = '─';
        }
      }

      if (G[i][j] === '┴') {
        if (G[i - 1][j] === ' ') {
          G[i][j] = '─';
        }
      }

      if (G[i][j] === '┼') {
        if (G[i][j + 1] === ' ' && G[i - 1][j] === ' ' && G[i][j - 1] !== ' ' && G[i + 1][j] !== ' ') {
          G[i][j] = '┐';
        } else if (G[i][j - 1] === ' ' && G[i - 1][j] === ' ' && G[i + 1][j] !== ' ' && G[i][j + 1] !== ' ') {
          G[i][j] = '┌';
        } else if (G[i][j - 1] === ' ' && G[i + 1][j] === ' ' && G[i - 1][j] !== ' ' && G[i][j + 1] !== ' ') {
          G[i][j] = '└';
        } else if (G[i][j + 1] === ' ' && G[i + 1][j] === ' ' && G[i - 1][j] !== ' ' && G[i][j - 1] !== ' ') {
          G[i][j] = '┘';
        } else if (G[i][j + 1] === ' ' && G[i][j - 1] === ' ' && (G[i + 1][j] === ' ' || G[i - 1][j] === ' ')) {
          G[i][j] = '│';
        } else if (G[i + 1][j] === ' ' && G[i - 1][j] === ' ' && (G[i][j - 1] === ' ' || G[i][j + 1] === ' ')) {
          G[i][j] = '─';
        } else if (G[i][j + 1] === ' ' && G[i][j - 1] === ' ') {
          G[i][j] = '│';
        } else if (G[i + 1][j] === ' ' && G[i - 1][j] === ' ') {
          G[i][j] = '─';
        } else if (G[i + 1][j] === ' ' && G[i - 1][j] !== ' ' && G[i][j - 1] !== ' ' && G[i][j + 1] !== ' ') {
          G[i][j] = '┴';
        } else if (G[i - 1][j] === ' ' && G[i + 1][j] !== ' ' && G[i][j + 1] !== ' ' && G[i][j - 1] !== ' ') {
          G[i][j] = '┬';
        } else if (G[i][j + 1] === ' ' && G[i - 1][j] !== ' ' && G[i + 1][j] !== ' ' && G[i][j - 1] !== ' ') {
          G[i][j] = '┤';
        } else if (G[i][j - 1] === ' ' && G[i - 1][j] !== ' ' && G[i + 1][j] !== ' ' && G[i][j + 1] !== ' ') {
          G[i][j] = '├';
        }
      }
    }
  }
}

class disjointSet {
  constructor() {
    this.set = [];
    this.elements = 0;
  }

  addElements(numberOfElements) {
    for (let i = 0; i < numberOfElements; i++) {
      this.elements++;
      this.set.push(-1);
    }
  }

  find(element) {
    if (this.set[element] < 0) {
      return element;
    }
    return this.set[element] = this.find(this.set[element]);
  }

  setUnion(_a, _b) {
    const a = this.find(_a);
    const b = this.find(_b);

    if (a !== b) {
      const newSize = (this.set[a] + this.set[b]);
      if (this.compareSize(a, b)) {
        this.set[b] = a;
        this.set[a] = newSize;
      } else {
        this.set[a] = b;
        this.set[b] = newSize;
      }
    }
  }

  compareSize(a, b) {
    if (this.set[a] === this.set[b]) {
      return true;
    } else if (this.set[a] < this.set[b]) {
      return true;
    }
    return false;
  }
}

// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length;
  let t;
  let i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

buildMaze();
