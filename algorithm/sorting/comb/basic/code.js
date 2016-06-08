logger._print('original array = [' + D.join(', ') + ']');
var N = D.length;
var swapped;
var gap = N;            // initialize gap size
var shrink = 1.3;       // set the gap shrink factor

do{
    // update the gap value for the next comb.
    gap = Math.floor( gap/shrink );
    if( gap < 1 ){
        // minimum gap is 1
        gap = 1;
    }

    swapped = false;    // initialize swapped
    // a single comb over the input list
    for( var i=0; i+gap < N; i++ ){
        tracer._select(i)._select(i+gap)._wait();

        if( D[i] > D[i+gap] ){
            logger._print('swap ' + D[i] + ' and ' + D[i+gap]);     // log swap event
            
            var temp = D[i];
            D[i] = D[i+gap];
            D[i+gap] = temp;

            tracer._notify(i, D[i])._notify(i+gap, D[i+gap])._wait();
            tracer._denotify(i)._denotify(i+gap);

            swapped = true;     // Flag swapped has happened and list is not guaranteed sorted
        }
        tracer._deselect(i)._deselect(i+gap);
    } // End of combing
} while( gap!=1 || swapped  )