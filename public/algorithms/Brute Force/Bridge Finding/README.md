# Bridge Finding
An edge in an undirected connected graph is a bridge iff removing it disconnects the graph. A naive solution to finding bridges in a graph is to:<br /> 1.Delete an edge E<br /> 2.Perform DFS Exploration to check if the Graph is still connected<br /> 3.Restore Edge E. E is a bridge only if DFS exploration determines that the graph is disconnected without E. <br /> <br /> A more efficient solution, which can find bridges in linear time, is to perform a DFS (depth-first-search) on the graph. At each step: <br /> 1. Number the vertex with a counter. The first vertex visited should be labelled 0, the second vertex labelled 1, etc. <br /> 2. Each vertex should also keep track of the lowest numbered vertex that can be reached with the DFS. This can be done recursively by looking at the smallest "low" of its children <br /> 3. If the lowest vertex that can be reached with the DFS is greater than its own label, that means the edge with its parent is a bridge. This is because the vertex cannot reach its parent with the DFS, implying that the edge is not part of a cycle.

## Applications
* Finding vulnerabilities in Graphs and Electrical Circuits

## Complexity
* **Time**: worst Naive: ![](https://latex.codecogs.com/svg.latex?O(|E|\cdot(|V|+|E|))), Efficient: ![](https://latex.codecogs.com/svg.latex?O(|V|+|E|))
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(|V|\cdot|E|))

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Bridge_(graph_theory))
