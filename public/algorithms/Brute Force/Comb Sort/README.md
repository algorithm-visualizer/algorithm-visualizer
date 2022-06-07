# Comb Sort
Comb sort is a relatively simple sorting algorithm originally designed by Włodzimierz Dobosiewicz in 1980. Later it was rediscovered by Stephen Lacey and Richard Box in 1991. Comb sort improves on bubble sort. <br /><br />The basic idea is to eliminate turtles, or small values near the end of the list, since in a bubble sort these slow the sorting down tremendously. Rabbits, large values around the beginning of the list, do not pose a problem in bubble sort.

## Complexity
* **Time**: worst ![](https://latex.codecogs.com/svg.latex?O(n^2)), best ![](https://latex.codecogs.com/svg.latex?O(n\,log\,n)), average ![](https://latex.codecogs.com/svg.latex?O(n^2/2^p)), where ![](https://latex.codecogs.com/svg.latex?p) is the number of increment)
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(1)) auxiliary

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Comb_sort)