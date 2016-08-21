function BinarySearch(array, element) { // array = sorted array, element = element to be found
    var minIndex = 0;
    var maxIndex = array.length - 1;
    var testElement;

    while (minIndex <= maxIndex) {

        var middleIndex = Math.floor((minIndex + maxIndex) / 2);
        testElement = array[middleIndex];

        tracer._select(minIndex, maxIndex)._wait();
        tracer._notify(middleIndex);
        logger._print('Searching at index: ' + middleIndex)._wait();
        tracer._denotify(middleIndex);
        tracer._deselect(minIndex, maxIndex);

        if (testElement < element) {

            logger._print('Going right.');
            minIndex = middleIndex + 1;

        } else if (testElement > element) {

            logger._print('Going left.');
            maxIndex = middleIndex - 1;

        } else {

            logger._print(element + ' is found at position ' + middleIndex + '!');
            tracer._select(middleIndex);

            return middleIndex;
        }
    }

    logger._print(element + ' is not found!');
    return -1;
}

var element = D[Integer.random(0, D.length - 1)];

logger._print('Using iterative binary search to find ' + element);
BinarySearch(D, element);
