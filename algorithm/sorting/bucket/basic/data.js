var maxValue = 100;
var arraySize = 10;
var numBuckets = 5;

//initialize array values
var array = Array1D.random(arraySize, 0, maxValue - 1);
var buckets = [];
var bucketsCount = [];
var sortedArray = [];
for (let i = 0; i < arraySize; i++) {
    if (i < numBuckets) {
		buckets[i] = [];
		bucketsCount[i] = 0;
	}
    sortedArray[i] = 0;
}	
var D = [
    array,
    bucketsCount,
    sortedArray
];

var tracer = new Array2DTracer();
tracer._setData(D);
