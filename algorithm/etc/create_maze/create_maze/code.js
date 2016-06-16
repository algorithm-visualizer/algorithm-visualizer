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

    logger._print("initializing grid (all walls are up)");
    // init 'graph'
    // each room has two walls, a down and right wall.
	for (var i = 0; i < width; i++) {
		graph[i] = new Array(height);
		for(var j = 0; j < height; j++){
			graph[i][j] = location;

			walls[location] = {down: true, right: true};
			visitedMap[location] = false;

            // If you can label the rooms with just 2 digits
            if (width*height < 100) {
                var location_string = location.toString();

                G[j*2 + 1][i*3 + 1] = location_string[0];
                G[j*2 + 1][i*3 + 2] = location_string[1];

                tracer._setData(G);
            }

			rightWalls.push({x:i, y:j});
			downWalls.push({x:i, y:j});
			location++;
		}
	}

    logger._print("shuffled the walls for random selection");
    // Randomly shuffle the walls
	var rightWalls = shuffle(rightWalls);
	var downWalls = shuffle(downWalls);

    // Picking random walls to remove
	while(setSize != mySet.elements - 1){
		var randomWall = Math.floor((Math.random() * 2) + 1);
		if(randomWall === 1 && downWalls.length > 0){
            // Down wall
			var current_room = downWalls.pop();
			var i_x = current_room.x;
			var i_y = current_room.y;
			var i_y_down = i_y + 1;
			if(i_y_down < height){
				var u = graph[i_x][i_y];
				var v = graph[i_x][i_y_down];
                tracer._notify(i_y*2 + 1, i_x*3 + 1);
                tracer._notify(i_y*2 + 1, i_x*3 + 2);
                tracer._notify(i_y_down*2 + 1, i_x*3 + 1);
                tracer._notify(i_y_down*2 + 1, i_x*3 + 2);
				if(mySet.find(u) != mySet.find(v)){
                    logger._print('Rooms: ' + u + ' & ' + v + ' now belong to the same set, delete wall between them');

                    logger._wait();
					mySet.setUnion(u,v);
					setSize++;
                    // delete wall
					walls[u].down = false;
				}else{
                    logger._print('Rooms: ' + u + ' & ' + v + ' would create a cycle! This is not good!');
                    logger._wait();
                }
			}
            tracer._clear();
		}else if(randomWall === 2 && rightWalls.length > 0){
            // Right Wall
			var current_room = rightWalls.pop();
			var i_x = current_room.x;
			var i_y = current_room.y;
			var i_x_right = i_x + 1;
			if(i_x_right < width){
				var u = graph[i_x][i_y];
				var v = graph[i_x_right][i_y];
                tracer._notify(i_y*2 + 1, i_x*3 + 1);
                tracer._notify(i_y*2 + 1, i_x*3 + 2);
                tracer._notify(i_y*2 + 1, i_x_right*3 + 1);
                tracer._notify(i_y*2 + 1, i_x_right*3 + 2);
                if(mySet.find(u) != mySet.find(v)){
                    logger._print('Rooms: ' + u + ' & ' + v + ' now belong to the same set, delete wall between them');

                    logger._wait();
					mySet.setUnion(u,v);
					setSize++;
                    // delete wall
					walls[u].right = false;
				}else{
                    logger._print('Rooms: ' + u + ' & ' + v + ' would create a cycle! This is not good!');
                    logger._wait();
                }
			}
            tracer._clear();
		}
	}

    tracer._clear();

    logger._print("deleting the walls");
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

            if(current_wall.right === false){
                G[j*2 + 1][i*3 + 3] = ' ';
                tracer._select(j*2 +1 , i*3 + 3)._wait();
            }
            tracer._setData(G);
        }
    }
    logger._print('cleaning up the grid!');
    cleanUpGrid(width,height);

    // Clear out walls for the start and end locations.
    var random_start = Math.floor(Math.random()*width);
    var random_end = Math.floor(Math.random()*width);

    logger._print('setting the Start (S) & End (E) locations');

    // Start Location
    G[0][random_start*3 + 1] = ' ';
    G[0][random_start*3 + 2] = ' ';
    G[1][random_start*3 + 1] = 'S';

    // End Location
    G[v_end - 1][random_end*3 + 1] = ' ';
    G[v_end - 1][random_end*3 + 2] = ' ';
    G[v_end - 2][random_end*3 + 1] = 'E';

    cleanUpStartLocation(random_start);
    cleanUpEndLocation(random_end);

    logger._print('maze is completed!');

    // set the data
    tracer._setData(G);
}
function cleanUpStartLocation(start){
    if(G[0][start*3] === "┬" && G[1][start*3] === '│'){
        G[0][start*3] = '┐';
    }
    if(G[0][start*3 + 3] === "┬" && G[1][start * 3 + 3] === '│'){
        G[0][start*3 + 3] = '┌';
    }
    if(G[0][start*3] === '┌'){
        G[0][start*3] = '│';
    }
    if(G[0][start*3 + 3] === '┐'){
        G[0][start*3 + 3] = '│';
    }
}

function cleanUpEndLocation(end){
    if(G[v_end - 1][end*3] === '┴' && G[v_end - 2][end*3] === '│'){
        G[v_end - 1][end*3] = '┘';
    }
    if(G[v_end - 1][end*3+3] === '┴' && G[v_end - 2][end*3+3] === '│'){
        G[v_end - 1][end*3+3] = '└';
    }
    if(G[v_end - 1][end*3] === '└'){
        G[v_end - 1][end*3] = '│';
    }
    if(G[v_end - 1][end*3 + 3] === '┘'){
        G[v_end - 1][end*3 + 3] = '│';
    }
}

function cleanUpGrid(width,height){
    // Remove room numbers
    for (var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++){
                G[j*2 + 1][i*3 + 1] = ' ';
                G[j*2 + 1][i*3 + 2] = ' ';
        }
    }

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
