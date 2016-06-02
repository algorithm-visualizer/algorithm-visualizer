// Initialize LIS values for all indexes
for (var i = 0; i < A.length; i++) {
    LIS[i] = 1;
}

logger._print('Calculating Longest Increasing Subsequence values in bottom up manner ');
// Compute optimized LIS values in bottom up manner
for (var i = 1; i < A.length; i++) {
    tracer._select(i);
    logger._print(' LIS[' + i + '] = ' + LIS[i]);
    for (var j = 0; j < i; j++) {
        tracer._notify(j)._wait();
        tracer._denotify(j);
        if (A[i] > A[j] && LIS[i] < LIS[j] + 1) {
            LIS[i] = LIS[j] + 1;
            logger._print(' LIS[' + i + '] = ' + LIS[i]);
        }
    }
    tracer._deselect(i);
}

// Pick maximum of all LIS values
logger._print('Now calculate maximum of all LIS values ');
var max = LIS[0];
for (var i = 1; i < A.length; i++) {
	if (max < LIS[i]) {
		max = LIS[i];
	}
}
logger._print('Longest Increasing Subsequence = max of all LIS = ' + max);



/* Dynamic Programming C/C++ implementation of LIS problem */
#include<stdio.h>
#include<stdlib.h>
 
/* lis() returns the length of the longest increasing
  subsequence in arr[] of size n */
int lis( int arr[], int n )
{
    int *lis, i, j, max = 0;
    lis = (int*) malloc ( sizeof( int ) * n );
 
    /* Initialize LIS values for all indexes */
    for (i = 0; i < n; i++ )
        lis[i] = 1;
 
    /* Compute optimized LIS values in bottom up manner */
    for (i = 1; i < n; i++ )
        for (j = 0; j < i; j++ )
            if ( arr[i] > arr[j] && lis[i] < lis[j] + 1)
                lis[i] = lis[j] + 1;
 
    /* Pick maximum of all LIS values */
    for (i = 0; i < n; i++ )
        if (max < lis[i])
            max = lis[i];
 
    /* Free memory to avoid memory leak */
    free(lis);
 
    return max;
}
 
/* Driver program to test above function */
int main()
{
    int arr[] = { 10, 22, 9, 33, 21, 50, 41, 60 };
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Length of lis is %d\n", lis( arr, n ) );
    return 0;
}
