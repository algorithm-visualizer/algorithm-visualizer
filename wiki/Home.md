Check out:
- [**Contributing**](Contributing) for details on how to contribute to our project and 
- [**Project Details**](Project-Details) for details on how to build/run the project

## Hierarchy of `algorithm` Directory
| Path | Description |
|------|-------------|
| [/algorithm/category.json](https://github.com/parkjs814/AlgorithmVisualizer/tree/gh-pages/algorithm/category.json) | This file contains the list of categories and their algorithms. |
| [/algorithm/[category]/[algorithm]/desc.json](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/algorithm/graph_search/dfs/desc.json) | This file contains the description of the algorithm and the list of its examples. |
| [/algorithm/[category]/[algorithm]/[example]/data.js](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/algorithm/graph_search/dfs/tree/data.js) | This file predefines data variables that will be shown in a visualizing module. |
| [/algorithm/[category]/[algorithm]/[example]/code.js](https://github.com/parkjs814/AlgorithmVisualizer/blob/gh-pages/algorithm/graph_search/dfs/tree/code.js) | This file actually implements and visualizes the algorithm. |

## Visualizing Modules
* [Tracer](Tracer)
* [LogTracer](LogTracer)
* [Array2DTracer](Array2DTracer)
* [Array1DTracer](Array1DTracer)
* [DirectedGraphTracer](DirectedGraphTracer)
* [UndirectedGraphTracer](UndirectedGraphTracer)
* [WeightedDirectedGraphTracer](WeightedDirectedGraphTracer)
* [WeightedUndirectedGraphTracer](WeightedUndirectedGraphTracer)
* [ChartTracer](ChartTracer)

## Creating Random Data
| Function | Description |
|----------|-------------|
| **Integer.random**((Number) min, (Number) max) | Create a random integer inclusively between _min_ and _max_. |
| **Array2D.random**((Number) N, (Number) M, (Number) min, (Number) max) | Create random _N_ * _M_ array data that elements have a random value between _min_ and _max_. |
| **Array2D.randomSorted**((Number) N, (Number) M, (Number) min, (Number) max) | Basically same as `Array2D.random` but elements in each row are sorted in increasing order. |
| **Array1D.random**((Number) N, (Number) min, (Number) max) | Create random one-dimensional array data of size _N_ that elements have a random value between _min_ and _max_. |
| **Array1D.randomSorted**((Number) N, (Number) min, (Number) max) | Basically same as `Array1D.random` but elements are sorted in increasing order. |
| **DirectedGraph.random**((Number) N, (Number) ratio) | Create random graph data containing _N_ nodes and having directed edges between nodes at the probability of _ratio_ (between 0 and 1). |
| **UndirectedGraph.random**((Number) N, (Number) ratio) | Basically same as `DirectedGraph.random` but edges do not have direction. |
| **WeightedDirectedGraph.random**((Number) N, (Number) ratio, (Number) min, (Number) max) | Basically same as `DirectedGraph.random` but edges have a random weight between _min_ and _max_. |
| **WeightedUndirectedGraph.random**((Number) N, (Number) ratio) | Basically same as `WeightedDirectedGraph.random` but edges do not have direction. |