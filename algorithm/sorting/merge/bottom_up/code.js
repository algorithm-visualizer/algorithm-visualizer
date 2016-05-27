logger._print('original array = [' + D[0].join(', ') + ']');

function mergeSort(start, end) {
    if (Math.abs(end - start) <= 1) return;

    var mergeFrom = 0, mergeTo = 1, width, i;
    for (width = 1; width < end; width = width * 2) {
        /**/logger._print('merging arrays of width: ' + width);
        for (i = 0; i < end; i = i + 2 * width) {
            merge(mergeFrom, i, Math.min(i + width, end), Math.min(i + 2 * width, end), mergeTo);
        }
        //this could be copy(mergeTo, mergeFrom, start, end);
        //but it is more effecient to swap the input arrays
        //if you did copy here, you wouldn't need the copy at the end
        mergeFrom = (mergeFrom === 0 ? 1 : 0);
        mergeTo = 1 - mergeFrom;
    }
    if (mergeFrom !== 0) {
        /**/logger._print('final copy to original');
        copy(mergeFrom, mergeTo, start, end);
    }
}

function merge(mergeFrom, start, middle, end, mergeTo) {
    var i = start, j = middle, k;
    //in an actual merge implementation, mergeFrom and mergeTo would be arrays
    //here for the ability to trace what is going on better, the arrays are D[mergeFrom] and D[mergeTo]
    /**/logger._print('merging segments [' + start + '..' + middle + '] and [' + middle + '..' + end + ']');
    /**/tracer._selectRow(mergeFrom, start, end-1)._wait();
    /**/tracer._deselectRow(mergeFrom, start, end-1);

    for (k = start; k < end; k++) {
        /**/if (j < end) {
            /**/    tracer._select(mergeFrom, j);
            /**/}
        /**/if (i < middle) {
            /**/    tracer._select(mergeFrom, i);
            /**/}
        /**/if (i < middle && j < end) {
            /**/    logger._print('compare index ' + i + ' and ' + j + ', values: ' + D[mergeFrom][i] + ' and ' + D[mergeFrom][j])._wait();
            /**/}

        if (i < middle && (j >= end || D[mergeFrom][i] <= D[mergeFrom][j])) {
            /**/if (j < end) {
                /**/    logger._print('writing smaller value to output');
                /**/} else {
                /**/    logger._print('copying index ' + i + ' to output');
                /**/}
            /**/tracer._notify(mergeTo, k, D[mergeFrom][i])._wait();
            /**/tracer._denotify(mergeTo, k);
            /**/tracer._deselect(mergeFrom, i);

            D[mergeTo][k] = D[mergeFrom][i];
            i = i + 1;
        } else {
            /**/if(i < middle) {
                /**/    logger._print('writing smaller value to output');
                /**/} else {
                /**/    logger._print('copying index ' + j + ' to output');
                /**/}
            /**/tracer._notify(mergeTo, k, D[mergeFrom][j])._wait();
            /**/tracer._denotify(mergeTo, k);
            /**/tracer._deselect(mergeFrom, j);

            D[mergeTo][k] = D[mergeFrom][j];
            j = j + 1;
        }
    }
}

function copy(mergeFrom, mergeTo, start, end) {
    var i;
    for (i = start; i < end; i++) {
        /**/tracer._select(mergeFrom, i);
        /**/tracer._notify(mergeTo, i, D[mergeFrom][i])._wait();

        D[mergeTo][i] = D[mergeFrom][i];

        /**/tracer._deselect(mergeFrom, i);
        /**/tracer._denotify(mergeTo, i);
    }
}

mergeSort(0, D[0].length);
logger._print('sorted array = [' + D[0].join(', ') + ']');
