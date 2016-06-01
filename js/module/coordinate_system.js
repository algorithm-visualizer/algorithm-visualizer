const {
  DirectedGraph,
  DirectedGraphTracer
} = require('./directed_graph');

function CoordinateSystemTracer() {
  if (DirectedGraphTracer.apply(this, arguments)) {
    CoordinateSystemTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

CoordinateSystemTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
  constructor: CoordinateSystemTracer,
  name: 'CoordinateSystemTracer',
  init: function () {
    var tracer = this;

    this.s.settings({
      defaultEdgeType: 'def',
      funcEdgesDef: function (edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawEdge(edge, source, target, color, context, settings);
      }
    });
  },
  setData: function (C) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    for (var i = 0; i < C.length; i++)
      nodes.push({
        id: this.n(i),
        x: C[i][0],
        y: C[i][1],
        label: '' + i,
        size: 1,
        color: this.color.default
      });
    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  processStep: function (step, options) {
    switch (step.type) {
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? this.color.visited : this.color.left;
        targetNode.color = color;
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          if (this.graph.edges(edgeId)) {
            var edge = this.graph.edges(edgeId);
            edge.color = color;
            this.graph.dropEdge(edgeId).addEdge(edge);
          } else {
            this.graph.addEdge({
              id: this.e(step.target, step.source),
              source: this.n(step.source),
              target: this.n(step.target),
              color: color,
              size: 1
            });
          }
        }
        if (this.logTracer) {
          var source = step.source;
          if (source === undefined) source = '';
          this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
        }
        break;
      default:
        Tracer.prototype.processStep.call(this, step, options);
    }
  },
  e: function (v1, v2) {
    if (v1 > v2) {
      var temp = v1;
      v1 = v2;
      v2 = temp;
    }
    return 'e' + v1 + '_' + v2;
  },
  drawOnHover: function (node, context, settings, next) {
    var tracer = this;

    context.setLineDash([5, 5]);
    var nodeIdx = node.id.substring(1);
    this.graph.edges().forEach(function (edge) {
      var ends = edge.id.substring(1).split("_");
      if (ends[0] == nodeIdx) {
        var color = '#0ff';
        var source = node;
        var target = tracer.graph.nodes('n' + ends[1]);
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      } else if (ends[1] == nodeIdx) {
        var color = '#0ff';
        var source = tracer.graph.nodes('n' + ends[0]);
        var target = node;
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      }
    });
  },
  drawEdge: function (edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
      size = edge[prefix + 'size'] || 1;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(
      source[prefix + 'x'],
      source[prefix + 'y']
    );
    context.lineTo(
      target[prefix + 'x'],
      target[prefix + 'y']
    );
    context.stroke();
  }
});

var CoordinateSystem = {
  random: function (N, min, max) {
    if (!N) N = 7;
    if (!min) min = 1;
    if (!max) max = 10;
    var C = new Array(N);
    for (var i = 0; i < N; i++) C[i] = new Array(2);
    for (var i = 0; i < N; i++)
      for (var j = 0; j < C[i].length; j++)
        C[i][j] = (Math.random() * (max - min + 1) | 0) + min;
    return C;
  }
};

module.exports = {
  CoordinateSystem,
  CoordinateSystemTracer
};