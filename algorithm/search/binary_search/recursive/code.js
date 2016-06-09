function BinarySearch(array, element, minIndex, maxIndex) { // array = sorted array, element = element to be found, minIndex = low index, maxIndex = high index
    if (minIndex > maxIndex) {
        logger._print(element + ' is not found!');
        return -1;
    }

    var middleIndex = Math.floor((minIndex + maxIndex) / 2);
    var testElement = array[middleIndex];

    tracer._select(minIndex, maxIndex)._wait();
    tracer._notify(middleIndex);
    logger._print('Searching at index: ' + middleIndex)._wait();
    tracer._denotify(middleIndex);
    tracer._deselect(minIndex, maxIndex);

    if (testElement < element) {
        logger._print('Going right.');
        return BinarySearch(array, element, middleIndex + 1, maxIndex);
    }

    if (testElement > element) {
        logger._print('Going left.');
        return BinarySearch(array, element, minIndex, middleIndex - 1);
    }

    if (testElement === element) {
        logger._print(element + ' is found at position ' + middleIndex + '!');
        tracer._select(middleIndex);
        return middleIndex;
    }

    logger._print(element + ' is not found!');
    return -1;
}

var element = D[Integer.random(0, D.length - 1)];

logger._print('Using binary search to find ' + element);
BinarySearch(D, element, 0, D.length - 1);