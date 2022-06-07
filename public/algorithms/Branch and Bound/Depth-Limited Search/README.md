# Depth-Limited Search
Depth-Limited search (DLS) is an algorithm for traversing or searching tree or graph data structures. It's actually specific type of DFS where the search is limited to some depth from start node (root). One starts at the root (selecting some arbitrary node as the root in the case of a graph) and explores as far as possible (within some limit) along each branch before backtracking.

## Complexity
* **Time**: worst ![](https://latex.codecogs.com/svg.latex?O(b^l))
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(b\cdot\,l))
* **Notes**:
  * b is branching factor, for example binary tree has branching factor 2
  * l is limit that we define

## References
* [Colorado State University Lecture Notes](http://www.cs.colostate.edu/~anderson/cs440/index.html/doku.php?id=notes:week2b)
