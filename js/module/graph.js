var s = null, graph = null, graphMode = null;

GraphTracer.graphMode = "default";

function GraphTracer(module) {
    Tracer.call(this, module || GraphTracer);
    return initGraph(this.module);
}

GraphTracer.prototype = Object.create(Tracer.prototype);
GraphTracer.prototype.constructor = GraphTracer;

// Override
GraphTracer.prototype.resize = function () {
    Tracer.prototype.resize.call(this);

    this.refresh();
};

// Override
GraphTracer.prototype.reset = function () {
    Tracer.prototype.reset.call(this);

    resetGraphColor();
};

// Override
GraphTracer.prototype.setData = function (G) {
    if (Tracer.prototype.setData.call(this, arguments)) return;

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
            edges.push({
                id: e(i, G[i][j]),
                source: n(i),
                target: n(G[i][j]),
                color: graphColor.default,
                size: 1
            })
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
};

Tracer.prototype.clear = function () {
    this.pushStep({type: 'clear'}, true);
};

Tracer.prototype.visit = function (targetNode, sourceNode) {
    this.pushStep({type: 'visit', node: targetNode, Tracer: sourceNode}, true);
};

Tracer.prototype.leave = function (targetNode, sourceNode) {
    this.pushStep({type: 'leave', node: targetNode, Tracer: sourceNode}, true);
};

GraphTracer.prototype.processStep = function (step, options) {
    switch (step.type) {
        case 'clear':
            resetGraphColor();
            printTrace('clear traces');
            break;
        case 'visit':
        case 'leave':
            var visit = step.type == 'visit';
            var node = graph.nodes(n(step.node));
            var color = visit ? graphColor.visited : graphColor.left;
            node.color = color;
            if (step.Tracer !== undefined) {
                var edgeId = e(step.Tracer, step.node);
                var edge = graph.edges(edgeId);
                edge.color = color;
                graph.dropEdge(edgeId).addEdge(edge);
            }
            var Tracer = step.Tracer;
            if (Tracer === undefined) Tracer = '';
            printTrace(visit ? Tracer + ' -> ' + step.node : Tracer + ' <- ' + step.node);
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
    resetGraphColor();
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

var drawArrow = function (edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 2.5, settings('minArrowSize')),
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
    context.setLineDash([5, 7]);
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

var graphColor = {
    visited: '#f00',
    left: '#000',
    default: '#888'
};

var resetGraphColor = function () {
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

var initGraph = function (module) {
    if (s && graph && graphMode == module.graphMode) return false;
    graphMode = module.graphMode;

    $('.visualize_container').empty();
    s = new sigma({
        renderer: {
            container: $('.visualize_container')[0],
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
            labelSizeRatio: 1.3
        }
    });
    graph = s.graph;
    sigma.canvas.labels.def = function (node, context, settings) { // Override labels.def to draw label on the node
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
    sigma.canvas.hovers.def = function (node, context, settings) {
        var nodeIdx = node.id.substring(1);
        graph.edges().forEach(function (edge) {
            var ends = edge.id.substring(1).split("_");
            if (ends[0] == nodeIdx) {
                var color = '#0ff';
                var source = node;
                var target = graph.nodes('n' + ends[1]);
                drawArrow(edge, source, target, color, context, settings);
            } else if (ends[1] == nodeIdx) {
                var color = '#ff0';
                var source = graph.nodes('n' + ends[0]);
                var target = node;
                drawArrow(edge, source, target, color, context, settings);
            }
        });
    };
    sigma.plugins.dragNodes(s, s.renderers[0]);

    return true;
};