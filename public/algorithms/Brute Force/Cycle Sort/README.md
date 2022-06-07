# Cycle Sort
Cycle sort is an in-place, unstable sorting algorithm, a comparison sort that is theoretically optimal in terms of the total number of writes to the original array, unlike any other in-place sorting algorithm. It is based on the idea that the permutation to be sorted can be factored into cycles, which can individually be rotated to give a sorted result.

## Complexity
* **Time**: worst ![](https://latex.codecogs.com/svg.latex?O(n^2)), best ![](https://latex.codecogs.com/svg.latex?O(n^2)), average ![](https://latex.codecogs.com/svg.latex?O(n^2))
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(1)) auxiliary

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Cycle_sort)