# Binary Tree Traversal
In computer science, tree traversal (also known as tree search) is a form of graph traversal and refers to the process of visiting (checking and/or updating) each node in a tree data structure, exactly once. Such traversals are classified by the order in which the nodes are visited.

## Applications
* Pre-order traversal while duplicating nodes and edges can make a complete duplicate of a binary tree.
* Pre-order traversal can also be used to make a prefix expression (Polish notation) from expression trees: traverse the expression tree pre-orderly.
* In-order traversal is very commonly used on binary search trees because it returns values from the underlying set in order, according to the comparator that set up the binary search tree (hence the name).
* Post-order traversal while deleting or freeing nodes and values can delete or free an entire binary tree.
* Post-order traversal can also generate a postfix representation of a binary tree.

## Complexity
* **Time**: Best : ![](https://latex.codecogs.com/svg.latex?O(N)) Average : ![](https://latex.codecogs.com/svg.latex?O(N)) Worst : ![](https://latex.codecogs.com/svg.latex?O(N))
* **Space**: Worst: ![](https://latex.codecogs.com/svg.latex?O(N)) (recursive), Best: ![](https://latex.codecogs.com/svg.latex?O(1)) (iterative)

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal)