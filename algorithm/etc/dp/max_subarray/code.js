var maxSubarraySum = (function maxSubarray (array) {
	var maxSoFar = 0,
		maxEndingHere = 0;

	tracer._print ('Initializing maxSoFar = 0 & maxEndingHere = 0');

	for (var i = 0; i < array.length; i++) {
		tracer._select (i);
		tracer._print (maxEndingHere + ' + ' + array [i]);
		maxEndingHere += array [i];
		tracer._print ('=> ' + maxEndingHere);

		if (maxEndingHere < 0) {
			tracer._print ('maxEndingHere is negative, set to 0');
			maxEndingHere = 0;
		}

		if (maxSoFar < maxEndingHere) {
			tracer._print ('maxSoFar < maxEndingHere, setting maxSoFar to maxEndingHere (' + maxEndingHere + ')');
			maxSoFar = maxEndingHere;
		}
		
		tracer._deselect (i);
	}

	return maxSoFar;
}) (D);

tracer._print ('Maximum Subarray\'s Sum is: ' + maxSubarraySum);