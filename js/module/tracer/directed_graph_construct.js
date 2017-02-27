'use strict';

const Tracer = require('./tracer');

const {
  refineByType
} = require('../../tracer_manager/util/index');

class DirectedGraphConstructTracer extends Tracer {
  static getClassName() {
    return 'DirectedGraphConstructTracer';
  }

  constructor(name, nodePlacement = null) {
    super(name);
    this.nodePlacement = nodePlacement;
    this.nodeCollection = [];
    if (this.isNew) initView(this);
  }

  _addRoot(root) {
    this.manager.pushStep(this.capsule, {
      type: 'addRoot',
      arguments: arguments
    });
    return this;
  }

  _addNode(element, parentElement = null) {
    this.manager.pushStep(this.capsule, {
      type: 'addNode',
      arguments: arguments
    });
    return this;
  }

  _findNode(val) {
    var idToFind = this.n(val);
    var G = this.nodeCollection;
    var result = null;
    for (let i = 0; i < G.length; i++) {
      if(G[i].id === idToFind) {
        result = G[i];
        break;
      }
    }
    return result;
  }

  _visit(target, source) {
    this.manager.pushStep(this.capsule, {
      type: 'visit',
      target: target,
      source: source
    });
    return this;
  }

  _leave(target, source) {
    this.manager.pushStep(this.capsule, {
      type: 'leave',
      target: target,
      source: source
    });
    return this;
  }

  _setNodePositions(positions) {
    this.manager.pushStep(this.capsule, {
      type: 'setNodePositions',
      positions: positions
    });
    return this;
  }

  processStep(step, options) {
    switch (step.type) {
      case 'setTreeData':
        this.setTreeData.apply(this, step.arguments);
        break;
      case 'setNodePositions':
        $.each(this.graph.nodes(), (i, node) => {
          if (i >= step.positions.length) return false;
          const position = step.positions[i];
          node.x = position.x;
          node.y = position.y;
        });
        break;
      case 'addRoot':
        this.addRoot.apply(this, step.arguments);
        break;
      case 'addNode':
        this.addNode.apply(this, step.arguments);
        break;
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var nodeObject = this._findNode(step.target);
        nodeObject.visited = visit;
        nodeObject.isNew = false;
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? this.color.visited : this.color.left;
        if(targetNode) {
        targetNode.color = color;
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          var edge = this.graph.edges(edgeId);
          edge.color = color;
          this.graph.dropEdge(edgeId).addEdge(edge);
        }
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

  addRoot(root) {
    if(this.rootObject) throw 'Root for this graph is already added';
    this.rootObject = this.createGraphNode(root);
    this.drawGraph(this.rootObject.level);
  }

  addNode(node, parent) {
    var nodeObject = this.createGraphNode(node, parent)
    this.drawGraph(nodeObject.level);
  }

  createGraphNode(node, parent) {
    var nodeObject = this.nodeConstruct(node);
    var parentObject = this._findNode(parent);
    if (parentObject) {
      nodeObject.parent = parentObject;
      nodeObject.level = parentObject.level + 1;
      if (this.nodePlacement === null) {
        parentObject.children.push(nodeObject);
      } else if (this.nodePlacement === 0) {
        var isSpliced = false;
        var insertIndex = 0;
        if (parentObject.children.length > 0) {
          for(let i = 0; i < parentObject.children.length; i++) {
            var child = parentObject.children[i];
            if(child.originalVal > node) {
              isSpliced = true;
              break;
            }
            insertIndex++;
          }
        }
        if(isSpliced) {
          parentObject.children.splice(insertIndex, 0, nodeObject);
        } else {
          parentObject.children.push(nodeObject);
        }
      }
    }
    nodeObject.updateBreadth();
    this.nodeCollection.push(nodeObject);
    return nodeObject;
  }

  nodeConstruct(val) {
    var nodeObject = {
      id: this.n(val),
      originalVal: val,
      isNew: true,
      children: [],
      breadth: 0,
      level: 1,
      parent: null,
      visited: false,
      updateBreadth: function() {
        var oldBreadth = nodeObject.breadth;
        if ( nodeObject.children.length > 0 ) {
          nodeObject.breadth = nodeObject.children.length % 2 ? 0 : 1;
          for (let j = 0; j < nodeObject.children.length; j++) {
            nodeObject.breadth += nodeObject.children[j].breadth;
          }
        } else { nodeObject.breadth = 1; }
        if ( oldBreadth !== nodeObject.breadth && nodeObject.parent ) {
          nodeObject.parent.updateBreadth();
        }
      }
    }
    return nodeObject;
  }
  
  drawGraph(nodeLevel) {
    const nodes = [];
    const edges = [];
    var tracer = this;
    var drawNode = function (node, parentNode, occupiedBreadth) {
      var calculatedX = node.breadth;
      if (parentNode) {
        calculatedX = parentNode.breadth + occupiedBreadth - node.breadth;
      } else if (node.children.length > 0) {
        calculatedX = Math.ceil(calculatedX/node.children.length);
      }
      
      nodes.push({
        id: node.id,
        label: '' + node.originalVal,
        x: calculatedX,
        y: node.level - 1,
        size: 1,
        color: node.isNew ? tracer.color.selected : (node.visited ? tracer.color.visited : tracer.color.default),
        weight: 0
      });

      if ( node.children.length > 0 ) {
        var midPoint = node.children.length / 2;
        var occupiedBreadth = 0;
        for (let j = 0; j < node.children.length; j++) {
          var childNode = node.children[j];
          edges.push({
            id: tracer.e(node.originalVal, childNode.originalVal),
            source: node.id,
            target: childNode.id,
            color: node.visited && childNode.visited ? tracer.color.visited : tracer.color.default,
            size: 1,
            weight: refineByType(childNode.originalVal)
          });
          drawNode(childNode, node, occupiedBreadth);
          occupiedBreadth += node.breadth;
        }
      }
    };
    drawNode(this.rootObject);
    
    this.graph.clear();
    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: nodeLevel,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  }

  resize() {
    super.resize();

    this.s.renderers[0].resize();
    this.refresh();
  }

  refresh() {
    super.refresh();

    this.s.refresh();
  }

  clear() {
    super.clear();

    this.clearGraphColor();
    this.refresh();
  }

  clearGraphColor() {
    this.nodeCollection.forEach(function(node){
      node.isNew = false;
    });
    
    this.graph.nodes().forEach(function (node) {
      node.color = tracer.color.default;
    });
    this.graph.edges().forEach(function (edge) {
      edge.color = tracer.color.default;
    });
  }

  n(v) {
    return 'n' + v;
  }

  e(v1, v2) {
    return 'e' + v1 + '_' + v2;
  }

  getColor(edge, source, target, settings) {
    var color = edge.color,
      edgeColor = settings('edgeColor'),
      defaultNodeColor = settings('defaultNodeColor'),
      defaultEdgeColor = settings('defaultEdgeColor');
    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    return color;
  }

  drawLabel(node, context, settings) {
    var fontSize,
      prefix = settings('prefix') || '',
      size = node[prefix + 'size'];

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
    settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    context.textAlign = 'center';
    context.fillText(
      node.label,
      Math.round(node[prefix + 'x']),
      Math.round(node[prefix + 'y'] + fontSize / 3)
    );
  }

  drawArrow(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
      size = edge[prefix + 'size'] || 1,
      tSize = target[prefix + 'size'],
      sX = source[prefix + 'x'],
      sY = source[prefix + 'y'],
      tX = target[prefix + 'x'],
      tY = target[prefix + 'y'],
      angle = Math.atan2(tY - sY, tX - sX),
      dist = 3;
    sX += Math.sin(angle) * dist;
    tX += Math.sin(angle) * dist;
    sY += -Math.cos(angle) * dist;
    tY += -Math.cos(angle) * dist;
    var aSize = Math.max(size * 2.5, settings('minArrowSize')),
      d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
      aX = sX + (tX - sX) * (d - aSize - tSize) / d,
      aY = sY + (tY - sY) * (d - aSize - tSize) / d,
      vX = (tX - sX) * aSize / d,
      vY = (tY - sY) * aSize / d;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(
      aX,
      aY
    );
    context.stroke();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(aX + vX, aY + vY);
    context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
    context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
    context.lineTo(aX + vX, aY + vY);
    context.closePath();
    context.fill();
  }

  drawOnHover(node, context, settings, next) {
    var tracer = this;

    context.setLineDash([5, 5]);
    var nodeIdx = node.id.substring(1);
    this.graph.edges().forEach(function (edge) {
      var ends = edge.id.substring(1).split("_");
      if (ends[0] == nodeIdx) {
        var color = '#0ff';
        var source = node;
        var target = tracer.graph.nodes('n' + ends[1]);
        tracer.drawArrow(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      } else if (ends[1] == nodeIdx) {
        var color = '#ff0';
        var source = tracer.graph.nodes('n' + ends[0]);
        var target = node;
        tracer.drawArrow(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      }
    });
  }
}

const initView = (tracer) => {
  tracer.s = tracer.capsule.s = new sigma({
    renderer: {
      container: tracer.$container[0],
      type: 'canvas'
    },
    settings: {
      minArrowSize: 8,
      defaultEdgeType: 'arrow',
      maxEdgeSize: 2.5,
      labelThreshold: 4,
      font: 'Roboto',
      defaultLabelColor: '#fff',
      zoomMin: 0.6,
      zoomMax: 1.2,
      skipErrors: true,
      minNodeSize: .5,
      maxNodeSize: 12,
      labelSize: 'proportional',
      labelSizeRatio: 1.3,
      funcLabelsDef(node, context, settings) {
        tracer.drawLabel(node, context, settings);
      },
      funcHoversDef(node, context, settings, next) {
        tracer.drawOnHover(node, context, settings, next);
      },
      funcEdgesArrow(edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawArrow(edge, source, target, color, context, settings);
      }
    }
  });
  sigma.plugins.dragNodes(tracer.s, tracer.s.renderers[0]);
  tracer.graph = tracer.capsule.graph = tracer.s.graph;
};

sigma.canvas.labels.def = function (node, context, settings) {
  var func = settings('funcLabelsDef');
  if (func) {
    func(node, context, settings);
  }
};
sigma.canvas.hovers.def = function (node, context, settings) {
  var func = settings('funcHoversDef');
  if (func) {
    func(node, context, settings);
  }
};
sigma.canvas.edges.def = function (edge, source, target, context, settings) {
  var func = settings('funcEdgesDef');
  if (func) {
    func(edge, source, target, context, settings);
  }
};
sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
  var func = settings('funcEdgesArrow');
  if (func) {
    func(edge, source, target, context, settings);
  }
};

module.exports = DirectedGraphConstructTracer;
