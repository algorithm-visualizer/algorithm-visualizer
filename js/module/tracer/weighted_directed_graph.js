'use strict';

const DirectedGraphTracer = require('./directed_graph');

const {
  refineByType
} = require('../../tracer_manager/util/index');

class WeightedDirectedGraphTracer extends DirectedGraphTracer {
  static getClassName() {
    return 'WeightedDirectedGraphTracer';
  }

  constructor(name) {
    super(name);

    if (this.isNew) initView(this);
  }

  _weight(target, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'weight',
      target: target,
      weight: weight
    });
    return this;
  }

  _visit(target, source, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'visit',
      target: target,
      source: source,
      weight: weight
    });
    return this;
  }

  _leave(target, source, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'leave',
      target: target,
      source: source,
      weight: weight
    });
    return this;
  }

  processStep(step, options) {
    switch (step.type) {
      case 'weight':
        var targetNode = this.graph.nodes(this.n(step.target));
        if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
        break;
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? step.weight === undefined ? this.selectColor : this.visitedColor : this.leftColor;
        targetNode.color = color;
        if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          var edge = this.graph.edges(edgeId);
          edge.color = color;
          this.graph.dropEdge(edgeId).addEdge(edge);
        }
        if (this.logTracer) {
          var source = step.source;
          if (source === undefined) source = '';
          this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
        }
        break;
      default:
        super.processStep(step, options);
    }
  }

  clear() {
    super.clear();

    this.clearWeights();
  }

  clearWeights() {
    this.graph.nodes().forEach(function (node) {
      node.weight = 0;
    });
  }

  drawEdgeWeight(edge, source, target, color, context, settings) {
    if (source == target)
      return;

    var prefix = settings('prefix') || '',
      size = edge[prefix + 'size'] || 1;

    if (size < settings('edgeLabelThreshold'))
      return;

    if (0 === settings('edgeLabelSizePowRatio'))
      throw '"edgeLabelSizePowRatio" must not be 0.';

    var fontSize,
      x = (source[prefix + 'x'] + target[prefix + 'x']) / 2,
      y = (source[prefix + 'y'] + target[prefix + 'y']) / 2,
      dX = target[prefix + 'x'] - source[prefix + 'x'],
      dY = target[prefix + 'y'] - source[prefix + 'y'],
      angle = Math.atan2(dY, dX);

    fontSize = (settings('edgeLabelSize') === 'fixed') ?
      settings('defaultEdgeLabelSize') :
    settings('defaultEdgeLabelSize') *
    size *
    Math.pow(size, -1 / settings('edgeLabelSizePowRatio'));

    context.save();

    if (edge.active) {
      context.font = [
        settings('activeFontStyle'),
        fontSize + 'px',
        settings('activeFont') || settings('font')
      ].join(' ');

      context.fillStyle = color;
    } else {
      context.font = [
        settings('fontStyle'),
        fontSize + 'px',
        settings('font')
      ].join(' ');

      context.fillStyle = color;
    }

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';

    context.translate(x, y);
    context.rotate(angle);
    context.fillText(
      edge.weight,
      0,
      (-size / 2) - 3
    );

    context.restore();
  }

  drawNodeWeight(node, context, settings) {
    var fontSize,
      prefix = settings('prefix') || '',
      size = node[prefix + 'size'];

    if (size < settings('labelThreshold'))
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
    settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    context.textAlign = 'left';
    context.fillText(
      node.weight,
      Math.round(node[prefix + 'x'] + size * 1.5),
      Math.round(node[prefix + 'y'] + fontSize / 3)
    );
  }
}

const initView = (tracer) => {
  tracer.s.settings({
    edgeLabelSize: 'proportional',
    defaultEdgeLabelSize: 20,
    edgeLabelSizePowRatio: 0.8,
    funcLabelsDef(node, context, settings) {
      tracer.drawNodeWeight(node, context, settings);
      tracer.drawLabel(node, context, settings);
    },
    funcHoversDef(node, context, settings) {
      tracer.drawOnHover(node, context, settings, tracer.drawEdgeWeight);
    },
    funcEdgesArrow(edge, source, target, context, settings) {
      var color = tracer.getColor(edge, source, target, settings);
      tracer.drawArrow(edge, source, target, color, context, settings);
      tracer.drawEdgeWeight(edge, source, target, color, context, settings);
    }
  });
};

module.exports = WeightedDirectedGraphTracer;
