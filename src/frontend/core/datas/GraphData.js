import { Data } from '/core/datas';
import { distance } from '/common/util';
import { tracerManager } from '/core';

class GraphData extends Data {
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      directed: true,
      weighted: false,
    };
  }

  init() {
    super.init();
    this.dimensions = {
      baseWidth: 320,
      baseHeight: 320,
      padding: 32,
      nodeRadius: 12,
      arrowGap: 4,
      nodeWeightGap: 4,
      edgeWeightGap: 4,
    };
    this.logData = null;
  }

  set(array2d = [], layout = GraphData.LAYOUT.CIRCLE, root = 0) {
    const { directed, weighted } = this.options;
    const { baseWidth, baseHeight, padding } = this.dimensions;
    this.graph = new Graph([], [], directed);
    for (let i = 0; i < array2d.length; i++) {
      const id = i;
      const weight = null;
      const visited = false;
      this.graph.addNode(id, weight, visited);
      for (let j = 0; j < array2d.length; j++) {
        const value = array2d[i][j];
        if (value) {
          const source = i;
          const target = j;
          const weight = weighted ? value : null;
          const visited = false;
          this.graph.addEdge(source, target, weight, visited);
        }
      }
    }
    const left = -baseWidth / 2 + padding;
    const top = -baseHeight / 2 + padding;
    const right = baseWidth / 2 - padding;
    const bottom = baseHeight / 2 - padding;
    const width = right - left;
    const height = bottom - top;
    const rect = { left, top, right, bottom, width, height };
    switch (layout) {
      case GraphData.LAYOUT.CIRCLE:
        this.graph.layoutCircle(rect);
        break;
      case GraphData.LAYOUT.TREE:
        this.graph.layoutTree(rect, root);
        break;
      case GraphData.LAYOUT.RANDOM:
        this.graph.layoutRandom(rect);
        break;
      case GraphData.LAYOUT.NONE:
      default:
        break;
    }
    super.set();
  }

  visit(target, source, weight) {
    this.visitOrLeave(target, source, weight, true);
  }

  leave(target, source, weight) {
    this.visitOrLeave(target, source, weight, false);
  }

  visitOrLeave(target, source, weight, visit) {
    const edge = this.graph.findEdge(source, target);
    if (edge) edge.visited = visit;
    const node = this.graph.findNode(target);
    node.weight = weight;
    node.visited = visit;
    this.render();
    if (this.logData) {
      this.logData.print(visit ? (source || '') + ' -> ' + target : (source || '') + ' <- ' + target);
    }
  }

  updateNode(id, update) {
    const node = this.graph.findNode(id);
    Object.assign(node, update);
    this.render();
  }

  log(tracerKey) {
    this.logData = tracerKey ? tracerManager.datas[tracerKey] : null;
  }
}

class Graph {
  constructor(nodes, edges, directed) {
    this.nodes = nodes;
    this.edges = edges;
    this.directed = directed;
  }

  addNode(id, weight, visited, x = 0, y = 0) {
    if (this.findNode(id)) return;
    this.nodes.push({ id, weight, visited, x, y });
  }

  addEdge(source, target, weight, visited) {
    if (this.findEdge(source, target)) return;
    this.edges.push({ source, target, weight, visited });
  }

  findNode(id) {
    return this.nodes.find(node => node.id === id);
  }

  findEdge(source, target, directed = this.directed) {
    if (directed) {
      return this.edges.find(edge => edge.source === source && edge.target === target);
    } else {
      return this.edges.find(edge =>
        edge.source === source && edge.target === target ||
        edge.source === target && edge.target === source);
    }
  }

  findLinkedEdges(source, directed = this.directed) {
    if (directed) {
      return this.edges.filter(edge => edge.source === source);
    } else {
      return this.edges.filter(edge => edge.source === source || edge.target === source);
    }
  }

  findLinkedNodeIds(source, directed = this.directed) {
    const edges = this.findLinkedEdges(source, directed);
    return edges.map(edge => edge.source === source ? edge.target : edge.source);
  }

  findLinkedNodes(source, directed = this.directed) {
    const ids = this.findLinkedNodeIds(source, directed);
    return ids.map(id => this.findNode(id));
  }

  layoutCircle(rect) {
    const unitAngle = 2 * Math.PI / this.nodes.length;
    let angle = -Math.PI / 2;
    for (const node of this.nodes) {
      const x = Math.cos(angle) * rect.width / 2;
      const y = Math.sin(angle) * rect.height / 2;
      node.x = x;
      node.y = y;
      angle += unitAngle;
    }
  }

  layoutTree(rect, root) {
    let maxDepth = 0;
    const leafCounts = {};
    let marked = {};
    const recursiveAnalyze = (id, depth) => {
      marked[id] = true;
      leafCounts[id] = 0;
      if (maxDepth < depth) maxDepth = depth;
      const linkedNodeIds = this.findLinkedNodeIds(id, false);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) continue;
        leafCounts[id] += recursiveAnalyze(linkedNodeId, depth + 1);
      }
      if (leafCounts[id] === 0) leafCounts[id] = 1;
      return leafCounts[id];
    };
    recursiveAnalyze(root, 0);

    const hGap = rect.width / leafCounts[root];
    const vGap = rect.height / maxDepth;
    marked = {};
    const recursivePosition = (node, h, v) => {
      marked[node.id] = true;
      node.x = rect.left + (h + leafCounts[node.id] / 2) * hGap;
      node.y = rect.top + v * vGap;
      const linkedNodes = this.findLinkedNodes(node.id, false);
      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) continue;
        recursivePosition(linkedNode, h, v + 1);
        h += leafCounts[linkedNode.id];
      }
    };
    const rootNode = this.findNode(root);
    recursivePosition(rootNode, 0, 0);
  }

  layoutRandom(rect) {
    const placedNodes = [];
    for (const node of this.nodes) {
      do {
        node.x = rect.left + Math.random() * rect.width;
        node.y = rect.top + Math.random() * rect.height;
      } while (placedNodes.find(placedNode => distance(node, placedNode) < 48));
      placedNodes.push(node);
    }
  }
}

GraphData.LAYOUT = {
  CIRCLE: 'circle',
  TREE: 'tree',
  RANDOM: 'random',
  NONE: 'none',
  // FORCE_DIRECTED: 'force_directed',
};

export default GraphData;