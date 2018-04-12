**Array1DTracer** inherits **[Array2DTracer](Array2DTracer)**.

## Methods

| Method | Description |
|--------|-------------|
| `Array1DTracer((String) name)` | create Array1DTracer and set its name |
| `attach((ChartTracer) chartTracer)` | automatically visualize array data to the bar chart |
| `palette((Object) {selected, notified, default})` | set colors (e.g., `{selected: 'green', notified: '#FFA500', default: 'rgb(255,255,255)'}`) |
| `_setData((Number[]) data)` | set one-dimensional array data to visualize |
| `_notify((Number) idx, (Number) v) ` | notify that the value of element _idx_ has been changed to _v_ |
| `_denotify((Number) idx) ` | stop notifying that the value of element _idx_ has been changed |
| `_select((Number) s, (Number) e) ` | select a range between elements _s_ and _e_ |
| `_select((Number) idx) ` | select element _idx_ |
| `_deselect((Number) s, (Number) e) ` | deselect a range between elements _s_ and _e_ |
| `_deselect((Number) idx) ` | deselect element _idx_ |
| `_separate((Number) idx) ` | put a divider between elements _idx_ and (_idx+1_) |
| `_deseparate((Number) idx) ` | remove a divider between elements _idx_ and (_idx+1_) |
| `_clear() ` | erase traces on the array |
| `_wait() ` | wait for a certain amount of time |

## Usage
[Show examples](https://github.com/search?utf8=✓&q=Array1DTracer+repo%3Aparkjs814%2FAlgorithmVisualizer+path%3A%2Falgorithm&type=Code&ref=advsearch&l=&l=)