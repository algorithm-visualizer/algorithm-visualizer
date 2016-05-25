tracer._pace(500);

/*
Function to print all the permutations of a string
*/
function permute(rest, soFar) {
    var next;
    var remaining;

    if (rest == '') {
        tracer._print(soFar);
    } else {
        for (var i = 0; i < rest.length; i++) {

            remaining = rest.substr( 0, i) + rest.substr( i+1, rest.length-1);
            next = soFar + rest[i];
            tracer._notify(i);

            permute(remaining, next); // the recursive step 
        }
    }
}

tracer._print( ' Permutations are ' );
permute( string, '');