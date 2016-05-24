tracer._print('values = [');
for (var i = 0; i < D.length; i++) {
    tracer._print('&nbsp;&nbsp;&nbsp;&nbsp;[' + D[i].join(', ') + ']');
}
tracer._print(']');
var N = DP.length;
var M = DP[0].length;
for (var i = 0; i < N; i++) {
    for (var j = 0; j < M; j++) {
        tracer._sleep();
        if (i == 0 && j == 0) {
            tracer._select(i, j);
            DP[i][j] = D[i][j];
            tracer._deselect(i, j);
        } else if (i == 0) {
            tracer._select(i, j - 1);
            DP[i][j] = DP[i][j - 1] + D[i][j];
            tracer._deselect(i, j - 1);
        } else if (j == 0) {
            tracer._select(i - 1, j);
            DP[i][j] = DP[i - 1][j] + D[i][j];
            tracer._deselect(i - 1, j);
        } else {
            tracer._selectSet([{x: i, y: j - 1}, {x: i - 1, y: j}]);
            DP[i][j] = Math.max(DP[i][j - 1], DP[i - 1][j]) + D[i][j];
            tracer._deselectSet([{x: i, y: j - 1}, {x: i - 1, y: j}]);
        }
        tracer._notify(i, j);
    }
}
tracer._print('max = ' + DP[N - 1][M - 1]);