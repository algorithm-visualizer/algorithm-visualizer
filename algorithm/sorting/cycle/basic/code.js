logger._print( 'original array = [' + D.join(', ') + ']' );
var N = D.length;
var writes = 0;
var pos;
var item;
var temp;
for( var cycleStart=0; cycleStart<=N-2; cycleStart++ ){
    item = D[cycleStart];
    pos = cycleStart;
    for( var i=cycleStart+1; i<=N-1; i++ ){
        if( D[i]<item ){
            pos++;
        }
    }
    if( pos == cycleStart ){
        continue;
    }
    while( item == D[pos] ){
        pos++;
    }
    temp = D[pos];
    D[pos] = item;
    item = temp;

    logger._print( 'Rewrite '+D[pos]+' to index '+pos );

    tracer._notify(pos, D[pos])._notify(cycleStart, D[cycleStart])._wait();
    tracer._denotify(pos)._denotify(pos);


    while( pos != cycleStart ){
        pos = cycleStart;
        for( i=cycleStart+1; i<=N-1; i++ ){
            if( D[i]<item ){
                pos++;
            }
        }

        while( item == D[pos] ){
            pos++;
        }
        temp = D[pos];
        D[pos] = item;
        item = temp;

        logger._print( 'Rewrite '+D[pos]+' to index '+pos );

        tracer._notify(pos, D[pos])._notify(cycleStart, D[cycleStart])._wait();
        tracer._denotify(pos)._denotify(pos);

        writes++;
    }

    writes++;
}

logger._print( 'Number of writes performed is ' + writes );
