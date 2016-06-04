'use strict';

const WeightedDirectedGraphTracer = require('./weighted_directed_graph');
const UndirectedGraphTracer = require('./undirected_graph');

class WeightedUndirectedGraphTracer extends WeightedDirectedGraphTracer {
  static getClassName() {
    return 'WeightedUndirectedGraphTracer';
  }

  constructor(name) {
    super(name);

    this.e = UndirectedGraphTracer.prototype.e;
    this.drawOnHover = UndirectedGraphTracer.prototype.drawOnHover;
    this.drawEdge = UndirectedGraphTracer.prototype.drawEdge;

    if (this.isNew) initView(this);
  }

  setTreeData(G, root) {
    return super.setTreeData(G, root, true);
  }

  setData(G) {
    return super.setData(G, true);
  }

  drawEdgeWeight(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '';
    if (source[prefix + 'x'] > target[prefix + 'x']) {
      var temp = source;
      source = target;
      target = temp;
    }
    WeightedDirectedGraphTracer.prototype.drawEdgeWeight.call(this, edge, source, target, color, context, settings);
  }
}

const initView = (tracer) => {
  tracer.s.settings({
    defaultEdgeType: 'def',
    funcEdgesDef(edge, source, target, context, settings) {
      var color = tracer.getColor(edge, source, target, settings);
      tracer.drawEdge(edge, source, target, color, context, settings);
      tracer.drawEdgeWeight(edge, source, target, color, context, settings);
    }
  });
};

module.exports = WeightedUndirectedGraphTracer;
