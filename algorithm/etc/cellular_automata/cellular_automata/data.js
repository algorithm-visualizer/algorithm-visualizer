var gridSize = 10;
var generations = 4;
var fillChance = 0.55;

var G = [];
var nextG = [];
for (var i = 0; i < gridSize; i++) {
	G[i] = [];
	nextG[i] = [];
	for (var j = 0; j < gridSize; j++) {
		if (Math.random() < fillChance || i === 0 || j === 0 || i == gridSize - 1 || j == gridSize - 1) {
			G[i][j] = '#';
		} else {
			G[i][j] = '.';
		}
		nextG[i][j] = '#';
	}
}
var tracer = new Array2DTracer ();
tracer._setData(G);

for (var gi = 0; gi < G.length; gi++) {
	for (var gj = 0; gj < G[gi].length; gj++) {
		if (G[gi][gj] == '#') {
			tracer._notify(gi, gj, G[gi][gj]);
		}
	}
}