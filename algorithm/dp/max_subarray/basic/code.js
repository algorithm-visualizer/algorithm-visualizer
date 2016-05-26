var maxSubarraySum = (function maxSubarray(array) {
    var maxSoFar = 0,
        maxEndingHere = 0;

    logger._print('Initializing maxSoFar = 0 & maxEndingHere = 0');

    for (var i = 0; i < array.length; i++) {
        tracer._select(i);
        logger._print(maxEndingHere + ' + ' + array[i]);
        maxEndingHere += array[i];
        logger._print('=> ' + maxEndingHere);

        if (maxEndingHere < 0) {
            logger._print('maxEndingHere is negative, set to 0');
            maxEndingHere = 0;
        }

        if (maxSoFar < maxEndingHere) {
            logger._print('maxSoFar < maxEndingHere, setting maxSoFar to maxEndingHere (' + maxEndingHere + ')');
            maxSoFar = maxEndingHere;
        }

        tracer._wait();
        tracer._deselect(i);
    }

    return maxSoFar;
})(D);

logger._print('Maximum Subarray\'s Sum is: ' + maxSubarraySum);