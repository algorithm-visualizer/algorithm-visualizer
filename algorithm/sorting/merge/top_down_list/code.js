logger._print('original array = [' + D.join(', ') + ']');

function mergeSort(start, end) {
    if (Math.abs(end - start) <= 1) return [];
    var middle = Math.ceil((start + end) / 2);

    mergeSort(start, middle);
    mergeSort(middle, end);

    logger._print('divide left[' + start + ', ' + (middle - 1) + '], right[' + (middle) + ', ' + (end - 1) + ']');
    return mergeSort.merge(start, middle, end);
}

mergeSort.merge = function (start, middle, end) {
    var leftSize = middle - start;
    var rightSize = end - middle;
    var maxSize = Math.max(leftSize, rightSize);
    var size = end - start;
    var left = [];
    var right = [];
    var i;

    for (i = 0; i < maxSize; i++) {
        if (i < leftSize) {
            left.push(D[start + i]);
            tracer._select(start + i);
            logger._print('insert value into left array[' + i + '] = ' + D[start + i])._wait();
        }
        if (i < rightSize) {
            right.push(D[middle + i]);
            tracer._select(middle + i);
            logger._print('insert value into right array[' + i + '] = ' + D[middle + i])._wait();
        }
    }
    logger._print('left array = [' + left.join(', ') + '], ' + 'right array = [' + right.join(', ') + ']');

    i = 0;
    while (i < size) {
        if (left[0] && right[0]) {
            if (left[0] > right[0]) {
                D[start + i] = right.shift();
                logger._print('rewrite from right array[' + i + '] = ' + D[start + i]);
            } else {
                D[start + i] = left.shift();
                logger._print('rewrite from left array[' + i + '] = ' + D[start + i]);
            }
        } else if (left[0]) {
            D[start + i] = left.shift();
            logger._print('rewrite from left array[' + i + '] = ' + D[start + i]);
        } else {
            D[start + i] = right.shift();
            logger._print('rewrite from right array[' + i + '] = ' + D[start + i]);
        }

        tracer._deselect(start + i);
        tracer._notify(start + i, D[start + i])._wait();
        tracer._denotify(start + i);
        i++;
    }

    var tempArray = [];
    for (i = start; i < end; i++) tempArray.push(D[i]);
    logger._print('merged array = [' + tempArray.join(', ') + ']');
};

mergeSort(0, D.length);
logger._print('sorted array = [' + D.join(', ') + ']');
