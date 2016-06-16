var tracer = new Array2DTracer();
var logger = new LogTracer();
var n = 6; // rows (change these!)
var m = 6; // columns (change these!)

var h_end = m * 4 - (m-1);
var v_end = n * 3 - (n-1);

var G = [];

for (var i = 0; i < v_end; i++) { // by row
    G[i] = new Array(h_end);
    for(var j = 0; j < h_end; j++){ // by column

        G[i][j] = ' ';

        if(i === 0 && j === 0){ // top-left corner
            G[i][j] = '┌';
        }else if( i === 0 && j === h_end-1){ // top-right corner
            G[i][j] = '┐';
        }else if(i === v_end - 1 && j === 0){ // bottom-left corner
            G[i][j] = '└';
        }else if(i === v_end - 1 && j === h_end - 1){ // bottom-right corner
            G[i][j] = '┘';
        }else if( (j % 3 === 0) && (i % v_end !== 0 && i !== v_end-1 && i % 2 == 1)){
            G[i][j] = '│';
        }else if (i % 2 === 0){
            G[i][j] = '─';
        }

        if(m > 1){ // More than one column
            if( j % 3 === 0 && j !== 0 && j !== h_end - 1 && i === 0){
                G[i][j] = '┬';
            }
            if( j % 3 === 0 && j !== 0 && j !== h_end - 1 && i === v_end-1){
                G[i][j] = '┴';
            }
        }

        if(n > 1){ // More than one row
            if(i % 2 === 0 && i !== 0 && i !==v_end-1 && j === 0){
                G[i][j] = '├';
            }
            if(i % 2 === 0 && i !== 0 && i !==v_end-1 && j === h_end-1){
                G[i][j] = '┤';
            }
        }

        if(n > 1 && m > 1){ // More than one row and column
            if(i % 2 === 0 && j % 3 === 0 && i !== 0 && j !== 0 && i !== v_end-1 && j !== h_end-1){
                G[i][j] = '┼';
            }
        }
    }
}

tracer._setData(G);
