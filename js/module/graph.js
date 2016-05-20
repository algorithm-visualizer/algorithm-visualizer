var s = null, graph = null, sigmaCanvas = null;

function GraphTracer(module) {
    if (Tracer.call(this, module || GraphTracer)) {
        initGraph();
        return true;
    }
    return false;
}

GraphTracer.prototype = Object.create(Tracer.prototype);
GraphTracer.prototype.constructor = GraphTracer;

// Override
GraphTracer.prototype.resize = function () {
    Tracer.prototype.resize.call(this);

    this.refresh();
};

// Override
GraphTracer.prototype.clear = function () {
    Tracer.prototype.clear.call(this);

    clearGraphColor();
};

// Override
GraphTracer.prototype.createRandomData = function (N, ratio) {
    if (!N) N = 5;
    if (!ratio) ratio = .3;
    var G = [];
    for (var i = 0; i < N; i++) {
        G.push([]);
        for (var j = 0; j < N; j++) {
            if (i == j) G[i].push(0);
            else G[i].push((Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0);
        }
    }
    return G;
};

GraphTracer.prototype.setTreeData = function (G, root) {
    root = root || 0;
    var maxDepth = -1;

    var chk = [];
    for (var i = 0; i < G.length; i++) chk.push(false);
    var getDepth = function (node, depth) {
        if (chk[node]) throw "the given graph is not a tree because it forms a circuit";
        chk[node] = true;
        if (maxDepth < depth) maxDepth = depth;
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) getDepth(i, depth + 1);
        }
    };
    getDepth(root, 1);

    if (this.setData(G, root)) return true;

    var place = function (node, x, y) {
        var temp = graph.nodes(n(node));
        temp.x = x;
        temp.y = y;
    };

    var wgap = 1 / (maxDepth - 1);
    var dfs = function (node, depth, top, bottom) {
        place(node, depth * wgap, (top + bottom) / 2);
        var children = 0;
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) children++;
        }
        var vgap = (bottom - top) / children;
        var cnt = 0;
        for (var i = 0; i < G[node].length; i++) {
            if (G[node][i]) dfs(i, depth + 1, top + vgap * cnt, top + vgap * ++cnt);
        }
    };
    dfs(root, 0, 0, 1);

    this.refresh();
};

// Override
GraphTracer.prototype.setData = function (G) {
    if (Tracer.prototype.setData.call(this, arguments)) return true;
    
    graph.clear();
    var nodes = [];
    var edges = [];
    var unitAngle = 2 * Math.PI / G.length;
    var currentAngle = 0;
    for (var i = 0; i < G.length; i++) {
        currentAngle += unitAngle;
        nodes.push({
            id: n(i),
            label: '' + i,
            x: .5 + Math.sin(currentAngle) / 2,
            y: .5 + Math.cos(currentAngle) / 2,
            size: 1,
            color: graphColor.default
        });
        for (var j = 0; j < G[i].length; j++) {
            if (G[i][j]) {
                edges.push({
                    id: e(i, j),
                    source: n(i),
                    target: n(j),
                    color: graphColor.default,
                    size: 1
                });
            }
        }
    }

    graph.read({
        nodes: nodes,
        edges: edges
    });
    s.camera.goTo({
        x: 0,
        y: 0,
        angle: 0,
        ratio: 1
    });
    this.refresh();

    return false;
};

GraphTracer.prototype._visit = function (target, source) {
    this.pushStep({type: 'visit', target: target, source: source}, true);
};

GraphTracer.prototype._leave = function (target, source) {
    this.pushStep({type: 'leave', target: target, source: source}, true);
};

GraphTracer.prototype.processStep = function (step, options) {
    switch (step.type) {
        case 'visit':
        case 'leave':
            var visit = step.type == 'visit';
            var targetNode = graph.nodes(n(step.target));
            var color = visit ? graphColor.visited : graphColor.left;
            targetNode.color = color;
            if (step.source !== undefined) {
                var edgeId = e(step.source, step.target);
                var edge = graph.edges(edgeId);
                edge.color = color;
                graph.dropEdge(edgeId).addEdge(edge);
            }
            var source = step.source;
            if (source === undefined) source = '';
            printTrace(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
            break;
    }
};

// Override
GraphTracer.prototype.refresh = function () {
    Tracer.prototype.refresh.call(this);

    s.refresh();
};

// Override
GraphTracer.prototype.prevStep = function () {
    this.clear();
    $('#tab_trace .wrapper').empty();
    var finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
        this.traceIndex = -1;
        this.refresh();
        return;
    }
    for (var i = 0; i < finalIndex; i++) {
        this.step(i, {virtual: true});
    }
    this.step(finalIndex);
};

var initGraph = function () {
    $('.module_container').empty();
    if (sigmaCanvas == null) {
        sigmaCanvas = $.extend(true, {}, sigma.canvas);
    } else {
        sigma.canvas = $.extend(true, {}, sigmaCanvas);
    }
    s = new sigma({
        renderer: {
            container: $('.module_container')[0],
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
            edgeLabelSize: 'proportional',
            defaultEdgeLabelSize: 20,
            edgeLabelSizePowRatio: 0.8
        }
    });
    graph = s.graph;
    sigma.canvas.labels.def = drawLabel;
    sigma.canvas.hovers.def = drawOnHover;
    sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
        var color = getColor(edge, source, target, settings);
        drawArrow(edge, source, target, color, context, settings);
    };
    sigma.plugins.dragNodes(s, s.renderers[0]);
};

var graphColor = {
    visited: '#f00',
    left: '#000',
    default: '#888'
};

var clearGraphColor = function () {
    graph.nodes().forEach(function (node) {
        node.color = graphColor.default;
    });
    graph.edges().forEach(function (edge) {
        edge.color = graphColor.default;
    });
};

var n = function (v) {
    return 'n' + v;
};

var e = function (v1, v2) {
    return 'e' + v1 + '_' + v2;
};

var getColor = function (edge, source, target, settings) {
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
};

var drawLabel = function (node, context, settings) {
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
};

var drawArrow = function (edge, source, target, color, context, settings) {
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
};

var drawOnHover = function (node, context, settings, next) {
    var nodeIdx = node.id.substring(1);
    graph.edges().forEach(function (edge) {
        var ends = edge.id.substring(1).split("_");
        context.setLineDash([5, 5]);
        if (ends[0] == nodeIdx) {
            var color = '#0ff';
            var source = node;
            var target = graph.nodes('n' + ends[1]);
            drawArrow(edge, source, target, color, context, settings);
            if (next) next(edge, source, target, color, context, settings);
        } else if (ends[1] == nodeIdx) {
            var color = '#ff0';
            var source = graph.nodes('n' + ends[0]);
            var target = node;
            drawArrow(edge, source, target, color, context, settings);
            if (next) next(edge, source, target, color, context, settings);
        }
    });
};