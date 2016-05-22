function BinarySearch(array, element) { // array = sorted array, element = element to be found,

    var minIndex = 0;
    var maxIndex = array.length - 1;
    var currentIndex;
    var testElement;

    while (minIndex <= maxIndex) {

        middleIndex = Math.floor((minIndex + maxIndex) / 2);
        testElement = array[middleIndex];

        tracer._print('Searching at index: ' + middleIndex);
        tracer._notify(middleIndex);

        if (testElement < element) {

            tracer._print('Going right.');
            minIndex = middleIndex + 1;

        } else if (testElement > element) {

            tracer._print('Going left.');
            maxIndex = middleIndex - 1;

        } else {

            tracer._print(element + ' is found at position ' + middleIndex + '!');
            tracer._select(middleIndex);

            return middleIndex;
        }
    }

    tracer._print(element + ' is not found!');
    return -1;
}

var element = D[Math.random() * D.length | 0];

tracer._sleep(1000);
tracer._pace(1000);
tracer._print('Using iterative binary search to find ' + element);
BinarySearch(D, element, 0, D.length - 1);