# PageRank
PageRank is an algorithm used by Google Search to rank websites in their search engine results.<br />Before viewing this visualization, we recommend you give the E-Factory Page a read (link provided under References).<br />The top-most view simulates a mini-internet: a web of connections. A directed edge from A to B means that web Page A provides a link to B. The next view will display the final ranks. We first calculate the no. of links a page has, i.e., its <b>outgoing edges</b> and display in the next view pane.<br />The last visual is an array of arrays. From 0 (top of matrix) down to the Nth Node (bottom), each stores an array of the <b>Nodes pointing to it</b>.<br />For eg-if the first line of Matrix says "2 3 -1 -1 -1", it means Web Page 2 and 3 have a link to Web Page 0. The -1s represent null (nothing).<br />The bottom-most view is where you will see the logs as the algorithm progresses.

## Applications
* Web Page Indexing for refining search results

## Complexity
* **Time**: worst ![](https://latex.codecogs.com/svg.latex?O(|V|+|E|))
* **Space**: worst ![](https://latex.codecogs.com/svg.latex?O(|V|))

## References
* [Princeton university](http://www.cs.princeton.edu/~chazelle/courses/BIB/pagerank.htm)
* [E-Factory](http://pr.efactory.de/e-pagerank-algorithm.shtml)
