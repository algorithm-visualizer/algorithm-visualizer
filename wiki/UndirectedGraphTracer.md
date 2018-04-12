**UndirectedGraphTracer** inherits **[DirectedGraphTracer](DirectedGraphTracer)**.

## Methods

| Method | Description |
|--------|-------------|
| `UndirectedGraphTracer((String) name)` | create UndirectedGraphTracer and set its name |
| `attach((LogTracer) logTracer)` | automatically print log when visiting or leaving nodes |
| `palette((Object) {visited, left, default})` | set colors (e.g., `{visited: 'green', left: '#FFA500', default: 'rgb(255,255,255)'}`) |
| `_setTreeData((Number[][]) tree, (Number) root) ` | set tree data to visualize |
| `_setData((Number[][]) graph) ` | set graph data to visualize |
| `_visit((Number) target, (Number) source) ` | visit _target_ node from _source_ node |
| `_leave((Number) target, (Number) source) ` | leave _target_ node to _source_ node |
| `_clear() ` | erase traces on the graph |
| `_wait() ` | wait for a certain amount of time |

## Usage
[Show examples](https://github.com/search?utf8=✓&q=UndirectedGraphTracer+repo%3Aparkjs814%2FAlgorithmVisualizer+path%3A%2Falgorithm&type=Code&ref=advsearch&l=&l=)