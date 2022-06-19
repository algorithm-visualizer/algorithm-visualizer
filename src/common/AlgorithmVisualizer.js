var Randomize;
(function (Randomize) {
  function Integer(options) {
    var _a = options || {},
      _b = _a.min,
      min = _b === void 0 ? 1 : _b,
      _c = _a.max,
      max = _c === void 0 ? 9 : _c;
    return (Math.random() * (max - min + 1) + min) | 0;
  }
  Randomize.Integer = Integer;

  function Double(options) {
    var _a = options || {},
      _b = _a.min,
      min = _b === void 0 ? 0 : _b,
      _c = _a.max,
      max = _c === void 0 ? 1 : _c;
    return Math.random() * (max - min) + min;
  }
  Randomize.Double = Double;

  function String(options) {
    var _a = options || {},
      _b = _a.length,
      length = _b === void 0 ? 16 : _b,
      _c = _a.letters,
      letters = _c === void 0 ? "abcdefghijklmnopqrstuvwxyz" : _c;
    var text = "";
    for (var i = 0; i < length; i++) {
      text += letters[Integer({ min: 0, max: letters.length - 1 })];
    }
    return text;
  }
  Randomize.String = String;

  function Array2D(options) {
    var _a = options || {},
      _b = _a.N,
      N = _b === void 0 ? 10 : _b,
      _c = _a.M,
      M = _c === void 0 ? 10 : _c,
      _d = _a.value,
      value =
        _d === void 0
          ? function () {
              return Integer();
            }
          : _d,
      _e = _a.sorted,
      sorted = _e === void 0 ? false : _e;
    var D = [];
    for (var i = 0; i < N; i++) {
      D.push([]);
      for (var j = 0; j < M; j++) {
        D[i].push(value(i, j));
      }
      if (sorted)
        D[i].sort(function (a, b) {
          return a - b;
        });
    }
    return D;
  }
  Randomize.Array2D = Array2D;

  function Array1D(options) {
    var _a = options || {},
      _b = _a.N,
      N = _b === void 0 ? 10 : _b,
      _c = _a.value,
      value =
        _c === void 0
          ? function () {
              return Integer();
            }
          : _c,
      _d = _a.sorted,
      sorted = _d === void 0 ? false : _d;
    return Array2D({
      N: 1,
      M: N,
      value:
        value &&
        function (i, j) {
          return value(j);
        },
      sorted: sorted,
    })[0];
  }
  Randomize.Array1D = Array1D;

  function Graph(options) {
    var _a = options || {},
      _b = _a.N,
      N = _b === void 0 ? 5 : _b,
      _c = _a.ratio,
      ratio = _c === void 0 ? 0.3 : _c,
      _d = _a.value,
      value =
        _d === void 0
          ? function () {
              return Integer();
            }
          : _d,
      _e = _a.directed,
      directed = _e === void 0 ? true : _e,
      _f = _a.weighted,
      weighted = _f === void 0 ? false : _f;
    var G = new Array(N);
    for (var i = 0; i < N; i++) {
      G[i] = new Array(N);
    }
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        if (i === j) {
          G[i][j] = 0;
        } else if (directed || i < j) {
          G[i][j] = Math.random() < ratio ? (weighted ? value(i, j) : 1) : 0;
        } else {
          G[i][j] = G[j][i];
        }
      }
    }
    return G;
  }
  Randomize.Graph = Graph;
})(Randomize || (Randomize = {}));
var Randomize$1 = Randomize;

var MAX_COMMANDS = 1000000;
var MAX_OBJECTS = 100;
var Commander = /** @class */ (function () {
  function Commander(iArguments) {
    Commander.objectCount++;
    var className = this.constructor.name;
    this.key = Commander.randomizeKey();
    this.command(className, iArguments);
  }
  /**
   * @ignore
   */
  Commander.init = function () {
    this.commands = [];
    this.objectCount = 0;
  };
  Commander.command = function (key, method, iArguments) {
    var args = Array.from(iArguments);
    this.commands.push({
      key: key,
      method: method,
      args: JSON.parse(JSON.stringify(args)),
    });
    if (this.commands.length > MAX_COMMANDS)
      throw new Error("Too Many Commands");
    if (this.objectCount > MAX_OBJECTS) throw new Error("Too Many Objects");
  };
  Commander.randomizeKey = function () {
    return Randomize$1.String({
      length: 8,
      letters: "abcdefghijklmnopqrstuvwxyz0123456789",
    });
  };
  /**
   * Remove the tracer.
   */
  Commander.prototype.destroy = function () {
    Commander.objectCount--;
    this.command("destroy", arguments);
  };
  Commander.prototype.command = function (method, iArguments) {
    Commander.command(this.key, method, iArguments);
  };
  Commander.prototype.toJSON = function () {
    return this.key;
  };
  /**
   * @ignore
   */
  Commander.commands = [];
  Commander.objectCount = 0;
  return Commander;
})();

/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
  
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
  
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }
  d.prototype =
    b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

var Layout = /** @class */ (function (_super) {
  __extends(Layout, _super);
  /**
   * Create a layout.
   *
   * @param children The child views to contain.
   */
  function Layout(children) {
    return _super.call(this, arguments) || this;
  }
  /**
   * Set a view as the root view.
   *
   * @param root
   */
  Layout.setRoot = function (root) {
    this.command(null, "setRoot", arguments);
  };
  /**
   * Add a child to the layout.
   *
   * @param child
   * @param index The index to add the child to.
   */
  Layout.prototype.add = function (child, index) {
    this.command("add", arguments);
  };
  /**
   * Remove a child from the layout.
   *
   * @param child
   */
  Layout.prototype.remove = function (child) {
    this.command("remove", arguments);
  };
  /**
   * Remove all the child views from the layout.
   */
  Layout.prototype.removeAll = function () {
    this.command("removeAll", arguments);
  };
  return Layout;
})(Commander);

var VerticalLayout = /** @class */ (function (_super) {
  __extends(VerticalLayout, _super);

  function VerticalLayout() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return VerticalLayout;
})(Layout);

var HorizontalLayout = /** @class */ (function (_super) {
  __extends(HorizontalLayout, _super);

  function HorizontalLayout() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return HorizontalLayout;
})(Layout);

var Tracer = /** @class */ (function (_super) {
  __extends(Tracer, _super);
  /**
   * Create a tracer.
   *
   * @param title
   */
  function Tracer(title) {
    return _super.call(this, arguments) || this;
  }
  /**
   * Pause to show changes in all tracers.
   *
   * @param lineNumber The line number to indicate when paused. If omitted, the line calling this method will be indicated.
   */
  Tracer.delay = function (lineNumber) {
    this.command(null, "delay", arguments);
  };
  /**
   * Reset the tracer.
   */
  Tracer.prototype.reset = function () {
    this.command("reset", arguments);
  };
  return Tracer;
})(Commander);

var LogTracer = /** @class */ (function (_super) {
  __extends(LogTracer, _super);

  function LogTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * Set initial log to show.
   *
   * @param log
   */
  LogTracer.prototype.set = function (log) {
    this.command("set", arguments);
  };
  /**
   * Print log.
   *
   * @param message
   */
  LogTracer.prototype.print = function (message) {
    this.command("print", arguments);
  };
  /**
   * Print log and put a line break.
   *
   * @param message
   */
  LogTracer.prototype.println = function (message) {
    this.command("println", arguments);
  };
  /**
   * Print formatted log.
   *
   * @param format Refer to [sprintf-js](https://github.com/alexei/sprintf.js#format-specification).
   * @param args
   */
  LogTracer.prototype.printf = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    this.command("printf", arguments);
  };
  return LogTracer;
})(Tracer);

var Array2DTracer = /** @class */ (function (_super) {
  __extends(Array2DTracer, _super);

  function Array2DTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * Set a two-dimensional array to visualize.
   *
   * @param array2d
   */
  Array2DTracer.prototype.set = function (array2d) {
    this.command("set", arguments);
  };
  /**
   * Notify that a value has been changed.
   *
   * @param x The row index of the array.
   * @param y The column index of the array.
   * @param v The new value to change to.
   */
  Array2DTracer.prototype.patch = function (x, y, v) {
    this.command("patch", arguments);
  };
  /**
   * Stop notifying that a value has been changed.
   *
   * @param x The row index of the array.
   * @param y The column index of the array.
   */
  Array2DTracer.prototype.depatch = function (x, y) {
    this.command("depatch", arguments);
  };
  /**
   * Select indices of the array.
   *
   * @param sx The row index to select inclusively from.
   * @param sy The column index to select inclusively from.
   * @param ex The row index to select inclusively to. If omitted, it will only select index `sx`.
   * @param ey The column index to select inclusively to. If omitted, it will only select index `sy`.
   */
  Array2DTracer.prototype.select = function (sx, sy, ex, ey) {
    this.command("select", arguments);
  };
  /**
   * Select indices of a row of the array.
   *
   * @param x The row index to select.
   * @param sy The column index to select inclusively from.
   * @param ey The column index to select inclusively to.
   */
  Array2DTracer.prototype.selectRow = function (x, sy, ey) {
    this.command("selectRow", arguments);
  };
  /**
   * Select indices of a column of the array.
   *
   * @param y The column index to select.
   * @param sx The row index to select inclusively from.
   * @param ex The row index to select inclusively to.
   */
  Array2DTracer.prototype.selectCol = function (y, sx, ex) {
    this.command("selectCol", arguments);
  };
  /**
   * Stop selecting indices of the array.
   *
   * @param sx The row index to stop selecting inclusively from.
   * @param sy The column index to stop selecting inclusively from.
   * @param ex The row index to stop selecting inclusively to. If omitted, it will only stop selecting index `sx`.
   * @param ey The column index to stop selecting inclusively to. If omitted, it will only stop selecting index `sy`.
   */
  Array2DTracer.prototype.deselect = function (sx, sy, ex, ey) {
    this.command("deselect", arguments);
  };
  /**
   * Stop selecting indices of a row of the array.
   *
   * @param x The row index to stop selecting.
   * @param sy The column index to stop selecting inclusively from.
   * @param ey The column index to stop selecting inclusively to.
   */
  Array2DTracer.prototype.deselectRow = function (x, sy, ey) {
    this.command("deselectRow", arguments);
  };
  /**
   * Stop selecting indices of a column of the array.
   *
   * @param y The column index to stop selecting.
   * @param sx The row index to stop selecting inclusively from.
   * @param ex The row index to stop selecting inclusively to.
   */
  Array2DTracer.prototype.deselectCol = function (y, sx, ex) {
    this.command("deselectCol", arguments);
  };
  return Array2DTracer;
})(Tracer);

var Array1DTracer = /** @class */ (function (_super) {
  __extends(Array1DTracer, _super);

  function Array1DTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * Set an array to visualize.
   *
   * @param array1d
   */
  Array1DTracer.prototype.set = function (array1d) {
    this.command("set", arguments);
  };
  /**
   * Notify that a value has been changed.
   *
   * @param x The index of the array.
   * @param v The new value to change to.
   */
  Array1DTracer.prototype.patch = function (x, v) {
    this.command("patch", arguments);
  };
  /**
   * Stop notifying that a value has been changed.
   *
   * @param x The index of the array.
   */
  Array1DTracer.prototype.depatch = function (x) {
    this.command("depatch", arguments);
  };
  /**
   * Select indices of the array.
   *
   * @param sx The index to select inclusively from.
   * @param ex The index to select inclusively to. If omitted, it will only select index `sx`.
   */
  Array1DTracer.prototype.select = function (sx, ex) {
    this.command("select", arguments);
  };
  /**
   * Stop selecting indices of the array.
   *
   * @param sx The index to stop selecting inclusively from.
   * @param ex The index to stop selecting inclusively to. If omitted, it will only stop selecting index `sx`.
   */
  Array1DTracer.prototype.deselect = function (sx, ex) {
    this.command("deselect", arguments);
  };
  /**
   * Synchronize with a chart tracer.
   *
   * @param chartTracer
   */
  Array1DTracer.prototype.chart = function (chartTracer) {
    this.command("chart", arguments);
  };
  return Array1DTracer;
})(Tracer);

var ChartTracer = /** @class */ (function (_super) {
  __extends(ChartTracer, _super);

  function ChartTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return ChartTracer;
})(Array1DTracer);

var GraphTracer = /** @class */ (function (_super) {
  __extends(GraphTracer, _super);

  function GraphTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * Set an adjacency matrix to visualize.
   *
   * @param array2d
   */
  GraphTracer.prototype.set = function (array2d) {
    this.command("set", arguments);
  };
  /**
   * Make the graph directed.
   *
   * @param isDirected
   */
  GraphTracer.prototype.directed = function (isDirected) {
    this.command("directed", arguments);
    return this;
  };
  /**
   * Make the graph weighted.
   *
   * @param isWeighted
   */
  GraphTracer.prototype.weighted = function (isWeighted) {
    this.command("weighted", arguments);
    return this;
  };
  /**
   * Arrange nodes on a circular layout.
   */
  GraphTracer.prototype.layoutCircle = function () {
    this.command("layoutCircle", arguments);
    return this;
  };
  /**
   * Arrange nodes on a tree layout.
   *
   * @param root The id of a root node.
   * @param sorted Whether to sort sibling nodes.
   */
  GraphTracer.prototype.layoutTree = function (root, sorted) {
    this.command("layoutTree", arguments);
    return this;
  };
  /**
   * Arrange nodes randomly.
   */
  GraphTracer.prototype.layoutRandom = function () {
    this.command("layoutRandom", arguments);
    return this;
  };
  /**
   * Add a node.
   *
   * @param id
   * @param weight
   * @param x The x position between `-160` and `+160`.
   * @param y The y position between `-160` and `+160`.
   */
  GraphTracer.prototype.addNode = function (id, weight, x, y) {
    this.command("addNode", arguments);
  };
  /**
   * Update a node.
   *
   * @param id
   * @param weight
   * @param x The x position between `-160` and `+160`.
   * @param y The y position between `-160` and `+160`.
   */
  GraphTracer.prototype.updateNode = function (id, weight, x, y) {
    this.command("updateNode", arguments);
  };
  /**
   * Remove a node.
   *
   * @param id
   */
  GraphTracer.prototype.removeNode = function (id) {
    this.command("removeNode", arguments);
  };
  /**
   * Add an edge.
   *
   * @param source The id of the node where the edge starts.
   * @param target The id of the node where the edge ends.
   * @param weight
   */
  GraphTracer.prototype.addEdge = function (source, target, weight) {
    this.command("addEdge", arguments);
  };
  /**
   * Update an edge.
   *
   * @param source The id of the node where the edge starts.
   * @param target The id of the node where the edge ends.
   * @param weight
   */
  GraphTracer.prototype.updateEdge = function (source, target, weight) {
    this.command("updateEdge", arguments);
  };
  /**
   * Remove an edge.
   *
   * @param source The id of the node where the edge starts.
   * @param target The id of the node where the edge ends.
   */
  GraphTracer.prototype.removeEdge = function (source, target) {
    this.command("removeEdge", arguments);
  };
  /**
   * Visit a node.
   *
   * @param target The id of the node to visit.
   * @param source The id of the node to visit from.
   * @param weight The weight of `target` to set to.
   */
  GraphTracer.prototype.visit = function (target, source, weight) {
    this.command("visit", arguments);
  };
  /**
   * Leave after visiting a node.
   *
   * @param target The id of the node to leave.
   * @param source The id of the node to leave to.
   * @param weight The weight of `target` to set to.
   */
  GraphTracer.prototype.leave = function (target, source, weight) {
    this.command("leave", arguments);
  };
  /**
   * Select a node.
   *
   * @param target The id of the node to select.
   * @param source The id of the node to select from.
   */
  GraphTracer.prototype.select = function (target, source) {
    this.command("select", arguments);
  };
  /**
   * Stop selecting a node.
   *
   * @param target The id of the node to stop selecting.
   * @param source The id of the node to stop selecting from.
   */
  GraphTracer.prototype.deselect = function (target, source) {
    this.command("deselect", arguments);
  };
  /**
   * Synchronize with a log tracer.
   *
   * @param logTracer
   */
  GraphTracer.prototype.log = function (logTracer) {
    this.command("log", arguments);
  };
  return GraphTracer;
})(Tracer);

var ScatterTracer = /** @class */ (function (_super) {
  __extends(ScatterTracer, _super);

  function ScatterTracer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return ScatterTracer;
})(Array2DTracer);

export {
  Array1DTracer,
  Array2DTracer,
  ChartTracer,
  Commander,
  GraphTracer,
  HorizontalLayout,
  Layout,
  LogTracer,
  Randomize,
  ScatterTracer,
  Tracer,
  VerticalLayout,
};
