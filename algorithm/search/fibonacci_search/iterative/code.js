function min(f, s){
    return f < s ? f : s;
}

function BinarySearch(array, element, minIndex, maxIndex) { // array = sorted array, element = element to be found, minIndex = low index, maxIndex = high index
    var fib2 = 0;
    var fib1 = 1;
    var fib = fib2 + fib1;
    
    while (fib < array.length){
        fib2 = fib1;
        fib1 = fib;
        fib = fib2 + fib1;
    }
    
    var offset = -1;
    while (fib > 1){
        var i = min(offset + fib2, array.length - 1);
        
        tracer._select(offset + fib2, array.length - 1)._wait();
        tracer._notify(i);
        logger._print('Searching at index: ' + i)._wait();
        tracer._denotify(i);
        tracer._deselect(offset + fib2, array.length - 1);
        
        if(array[i] < element){
            logger._print('Going right.');
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
        }else if(array[i] > element){
            logger._print('Going left.');
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
        }else{
            logger._print(element + ' is found at position ' + i + '!');
            tracer._select(i);
            return i;
        }
    }
    
    if (fib1 == 1 && arr[offset + 1] == element){
        logger._print(element + ' is found at position ' + offset + 1 + '!');
        tracer._select(offset + 1);
        return offset + 1;
    }
    logger._print(element + ' is not found!');
    return -1;
}

var element = D[Integer.random(0, D.length - 1)];

logger._print('Using fibonacci search to find ' + element);
BinarySearch(D, element, 0, D.length - 1);
