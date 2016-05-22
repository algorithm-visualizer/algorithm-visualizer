function BinarySearch(array, element, minIndex, maxIndex) { // array = sorted array, element = element to be found, minIndex = minIndex index, maxIndex = maxIndex index
    if (minIndex > maxIndex) {
        tracer._print(element + ' is not found!');
        return -1;
    }

    var middleIndex = Math.floor((minIndex + maxIndex) / 2);
    var testElement = array[middleIndex];

    tracer._print('Searching at index: ' + middleIndex);
    tracer._notify(middleIndex);

    if (testElement < element) {
        tracer._print('Going right.');
        return BinarySearch(array, element, middleIndex + 1, maxIndex);
    }

    if (testElement > element) {
        tracer._print('Going left.');
        return BinarySearch(array, element, minIndex, middleIndex - 1);
    }

    if (testElement === element) {
        tracer._print(element + ' is found at position ' + middleIndex + '!');
        tracer._select(middleIndex);
        return middleIndex;
    }

    tracer._print(element + ' is not found!');
    return -1;
}

var element = D[Math.random() * D.length | 0];

tracer._sleep(1000);
tracer._pace(1000);
tracer._print('Using binary search to find ' + element);
BinarySearch(D, element, 0, D.length - 1);