//place numbers into appropriate buckets
for (let i = 0; i < array.length; i++) {
	var bucketPos = Math.floor(numBuckets * (array[i] / maxValue));
	buckets[bucketPos].push(array[i]);
	bucketsCount[bucketPos]++;
	tracer._select(0, i)._wait();
	tracer._notify(1, bucketPos, D[1][bucketPos])._wait();
	tracer._deselect(0, i);
	tracer._denotify(1, bucketPos, D[1][bucketPos]);
}

var sortLocation = 0;
for (let k = 0; k < buckets.length; k++) {
	//do insertion sort
	for (let i = 1; i < buckets[k].length; i++) {
		var key = buckets[k][i];
		var j;
		for (j = i - 1; (j >= 0) && (buckets[k][j] > key); j--) {
			buckets[k][j + 1] = buckets[k][j];
		}
		buckets[k][j + 1] = key;
	}
	
	//place ordered buckets into sorted array
	for (let i = 0; i < buckets[k].length; i++) {
		sortedArray[sortLocation] = buckets[k][i];
		bucketsCount[k]--;
		tracer._notify(1, k, D[1][k]);
        tracer._notify(2, sortLocation, D[2][sortLocation])._wait();
		tracer._denotify(1, k, D[1][k]);
        tracer._denotify(2, sortLocation, D[2][sortLocation]);
		sortLocation++;
	}
}