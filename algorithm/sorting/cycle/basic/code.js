logger._print( 'original array = [' + D.join(', ') + ']' );
var N = D.length;
var writes = 0;
var pos;
var item;
var temp;
for( cycleStart=0; cycleStart<=N-2; cycleStart++ ){
    item = D[cycleStart];
    pos = cycleStart;
    tracer._select(cycleStart);

    for( i=cycleStart+1; i<=N-1; i++ ){
        tracer._select(i)._wait()._deselect(i);
        if( D[i]<item ){
            pos++;
        }
    }
    if( pos == cycleStart ){
        tracer._deselect(cycleStart);
        continue;
    }
    while( item == D[pos] ){
        pos++;
    }

    temp = D[pos];
    D[pos] = item;
    item = temp;

    if( pos !== cycleStart ){
        logger._print( 'Rewrite '+D[pos]+' to index '+pos+'; the next value to rewrite is '+item );    
    }else{
        logger._print( 'Rewrite '+D[pos]+' to index '+pos);    
    }
    tracer._select(pos)._wait()._deselect(pos);
    tracer._notify(pos, D[pos])._notify(cycleStart, D[cycleStart])._wait()._denotify(pos)._denotify(cycleStart);

    while( pos != cycleStart ){
        pos = cycleStart;
        
        for( i=cycleStart+1; i<=N-1; i++ ){
            tracer._select(i)._wait()._deselect(i);
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

        if( pos !== cycleStart ){
            logger._print( 'Rewrite '+D[pos]+' to index '+pos+'; the next value to rewrite is '+item );    
        }else{
            logger._print( 'Rewrite '+D[pos]+' to index '+pos);    
        }
        tracer._select(pos)._wait()._deselect(pos);
        tracer._notify(pos, D[pos])._notify(cycleStart, D[cycleStart])._wait()._denotify(pos)._denotify(cycleStart);

        writes++;
    }

    writes++;
}

logger._print( 'Number of writes performed is ' + writes );