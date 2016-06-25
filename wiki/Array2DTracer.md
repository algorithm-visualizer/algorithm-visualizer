**Array2DTracer** inherits **[Tracer](Tracer)**.

## Methods

| Method | Description |
|--------|-------------|
| **Array2DTracer**((String) name)| create Array2DTracer and set its name |
| **palette**((Object) {selected, notified, default})| set colors (e.g., `{selected: 'green', notified: '#FFA500', default: 'rgb(255,255,255)'}`) |
| **_setData**((Number[][]) data)| set two-dimensional array data to visualize |
| **_notify**((Number) x, (Number) y, (Number) v) | notify that the value of (x, y) has been changed to _v_ |
| **_denotify**((Number) x, (Number) y) | stop notifying that the value of (x, y) has been changed |
| **_select**((Number) sx, (Number) sy, (Number) ex, (Number) ey) | select a rectangle formed by (sx, sy) and (ex, ey) |
| **_select**((Number) x, (Number) y) | select (x, y) |
| **_selectRow**((Number) x, (Number) sy, (Number) ey) | equivalent to **_select**(x, sy, x, ey) |
| **_selectCol**((Number) y, (Number) sx, (Number) ex) | equivalent to **_select**(sx, y, ex, y) |
| **_deselect**((Number) sx, (Number) sy, (Number) ex, (Number) ey) | deselect a rectangle formed by (sx, sy) and (ex, ey) |
| **_deselect**((Number) x, (Number) y) | deselect (x, y) |
| **_deselectRow**((Number) x, (Number) sy, (Number) ey) | equivalent to **_deselect**(x, sy, x, ey) |
| **_deselectCol**((Number) y, (Number) sx, (Number) ex) | equivalent to **_deselect**(sx, y, ex, y) |
| **_separate**((Number) x, (Number) y) | put dividers between _x_-th and (_x+1_)-th rows and between _y_-th and (_y+1_)-th columns |
| **_separateRow**((Number) x) | put a divider between _x_-th and (_x+1_)-th rows |
| **_separateCol**((Number) y) | put a divider between _y_-th and (_y+1_)-th columns |
| **_deseparate**((Number) x, (Number) y) | remove dividers between _x_-th and (_x+1_)-th rows and between _y_-th and (_y+1_)-th columns |
| **_deseparateRow**((Number) x) | remove a divider between _x_-th and (_x+1_)-th rows |
| **_deseparateCol**((Number) y) | remove a divider between _y_-th and (_y+1_)-th columns |
| **_clear**() | erase traces on the array |
| **_wait**() | wait for a certain amount of time |

## Child Modules

* [Array1DTracer](Array1DTracer)

## Usage
[Show examples](https://github.com/search?utf8=✓&q=Array2DTracer+repo%3Aparkjs814%2FAlgorithmVisualizer+path%3A%2Falgorithm&type=Code&ref=advsearch&l=&l=)