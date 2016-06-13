function buildMaze(){
    var mySet = new disjoint_set();
    var width = m;
	var height = n;
	var setSize = 0;
	var graph = [];
	var visitedMap = {};
	var walls = {};
	var rightWalls = [];
	var downWalls = [];
	var location = 0;

	mySet.addElements(width*height);

    // init 'graph'
	for (var i = 0; i < width; i++) {
		graph[i] = new Array(height);
		for(var j = 0; j < height; j++){
			graph[i][j] = location;

			walls[location] = {down: true, right: true};
			visitedMap[location] = false;

			rightWalls.push({x:i, y:j});
			downWalls.push({x:i, y:j});
			location++;
		}
	};

	var rightWalls = shuffle(rightWalls);
	var downWalls = shuffle(downWalls);
	while(setSize != mySet.elements - 1){
		var randomWall = Math.floor((Math.random() * 2) + 1);
		if(randomWall === 1 && downWalls.length > 0){
            // Down wall
			var currNode = downWalls.pop();
			var i_x = currNode.x;
			var i_y = currNode.y;
			var i_y_down = i_y + 1;
			if(i_y_down < height){
				var u = graph[i_x][i_y];
				var v = graph[i_x][i_y_down];
				if(mySet.find(u) != mySet.find(v)){
					mySet.setUnion(u,v);
					setSize++;
                    // delete wall
					walls[u].down = false;
				}
			}
		}else if(randomWall === 2 && rightWalls.length > 0){
            // Right Wall
			var currNode = rightWalls.pop();
			var i_x = currNode.x;
			var i_y = currNode.y;
			var i_x_right = i_x + 1;
			if(i_x_right < width){
				var u = graph[i_x][i_y];
				var v = graph[i_x_right][i_y];
				if(mySet.find(u) != mySet.find(v)){
					mySet.setUnion(u,v);
					setSize++;
                    // delete wall
					walls[u].right = false;
				}
			}
		}
	}

    //update deleted walls
    for (var i = 0; i < width; i++) {
        for(var j = 0; j < height; j++){
            var current_wall = walls[graph[i][j]];

            if(current_wall.down === false){
                G[j*2 + 2][i*3 + 1] = ' ';
                G[j*2 + 2][i*3 + 2] = ' ';
                tracer._select(j*2 + 2, i*3 + 1)._wait();
                tracer._select(j*2 + 2, i*3 + 2)._wait();
            }
            // tracer._notify(i, j, G[i][j])._wait();
            if(current_wall.right === false){
                G[j*2 + 1][i*3 + 3] = ' ';
                tracer._select(j*2 +1 , i*3 + 3)._wait();
            }
            tracer._setData(G);
        }
    }

    // Start location
    G[0][0] = '│';
    G[0][1] = ' ';
    G[0][2] = ' ';
    // End location
    G[v_end-1][h_end-1] = '│';
    G[v_end-1][h_end-2] = ' ';
    G[v_end-1][h_end-3] = ' ';

    // clean up grid for looks
    for (var i = 0; i < v_end; i++) {
        for(var j = 0; j < h_end; j++){
            if(G[i][j] === '├'){
                if(G[i][j+1] === ' '){
                    G[i][j] = '│';
                }
            }

            if(G[i][j] === '┤'){
                if(G[i][j-1] === ' '){
                    G[i][j] = '│';
                }
            }

            if(G[i][j] === '┬'){
                if(G[i+1][j] === ' '){
                    G[i][j] = '─';
                }
            }

            if(G[i][j] === '┴'){
                if(G[i-1][j] === ' '){
                    G[i][j] = '─';
                }
            }

            if(G[i][j] === '┼'){
                if(G[i][j+1] === ' '&& G[i-1][j] === ' ' && G[i][j-1] !== ' ' && G[i+1][j] !== ' '){
                    G[i][j] = '┐';
                }
                else if(G[i][j-1] === ' '&& G[i-1][j] === ' ' && G[i+1][j] !== ' ' && G[i][j+1] !== ' '){
                    G[i][j] = '┌';
                }
                else if(G[i][j-1] === ' '&& G[i+1][j] === ' ' && G[i-1][j] !== ' ' && G[i][j+1] !== ' '){
                    G[i][j] = '└';
                }
                else if(G[i][j+1] === ' '&& G[i+1][j] === ' ' && G[i-1][j] !== ' ' && G[i][j-1] !== ' '){
                    G[i][j] = '┘';
                }

                else if(G[i][j+1] === ' '&& G[i][j-1] === ' ' && (G[i+1][j] === ' ' || G[i-1][j] === ' ')){
                    G[i][j] = '│';
                }
                else if(G[i+1][j] === ' '&& G[i-1][j] === ' ' && (G[i][j-1] === ' ' || G[i][j+1] === ' ')){
                    G[i][j] = '─';
                }

                else if(G[i][j+1] === ' '&& G[i][j-1] === ' ' ){
                    G[i][j] = '│';
                }
                else if(G[i+1][j] === ' '&& G[i-1][j] === ' '){
                    G[i][j] = '─';
                }
                else if(G[i+1][j] === ' ' && G[i-1][j] !== ' ' && G[i][j-1] !== ' ' && G[i][j+1] !== ' '){
                    G[i][j] = '┴';
                }

                else if(G[i-1][j] === ' ' && G[i+1][j] !== ' ' && G[i][j+1] !== ' ' && G[i][j-1] !== ' '){
                    G[i][j] = '┬';
                }

                else if(G[i][j+1] === ' ' && G[i-1][j] !== ' ' && G[i+1][j] !== ' ' && G[i][j-1] !== ' '){
                    G[i][j] = '┤';
                }

                else if(G[i][j-1] === ' ' && G[i-1][j] !== ' ' && G[i+1][j] !== ' ' && G[i][j+1] !== ' '){
                    G[i][j] = '├';
                }


            }

        }
    }

    G[1][1] = 'S';
    G[v_end-1][h_end-2] = 'E';
    // last wall clean up for start & end locations
    if(G[0][3] === '┬'){
        G[0][3] = '┌';
    }
    if(G[v_end-1][h_end-4] === '┴'){
        G[v_end-1][h_end-4] = '┘';
    }

    // set the data
    tracer._setData(G);
}

class disjoint_set {
    constructor(){
        this.set = [];
        this.elements = 0;
    }
    addElements(numberOfElements){
        for(var i = 0; i < numberOfElements; i++){
            this.elements++;
            this.set.push(-1);
        }
    }
    find(element){
        if(this.set[element] < 0){
            return element;
        }else {
            return this.set[element] = this.find(this.set[element]);
        }
    }
    setUnion(_a,_b){
        var a = this.find(_a);
        var b = this.find(_b);

        if(a != b){
            var newSize = (this.set[a] + this.set[b]);
            if(this.compareSize(a,b)){
                this.set[b] = a;
                this.set[a] = newSize;
            }else{
                this.set[a] = b;
                this.set[b] = newSize;
            }
        }
    }
    compareSize(a,b){
        if(this.set[a] === this.set[b]){
    		return true;
    	}else if(this.set[a] < this.set[b]){
    		return true;
    	}else{
    		return false;
    	}
    }
}

// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
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
