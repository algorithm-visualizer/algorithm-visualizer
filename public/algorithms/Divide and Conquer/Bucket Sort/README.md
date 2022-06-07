# Bucket Sort
Bucket sort, or bin sort, is a sorting algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm, or by recursively applying the bucket sorting algorithm.

## Complexity
* **Time**: worst ![](https://latex.codecogs.com/svg.latex?O(n^2)), best ![](https://latex.codecogs.com/svg.latex?O(n+k)), average ![](https://latex.codecogs.com/svg.latex?O(n+k)) where ![](https://latex.codecogs.com/svg.latex?n) is the number of buckets and ![](https://latex.codecogs.com/svg.latex?k) is the range of the input
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(n\cdot\,k))

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Bucket_sort)