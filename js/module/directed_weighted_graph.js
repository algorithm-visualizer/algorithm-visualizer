function WeightedDirectedGraphTracer(module) {
    if (DirectedGraphTracer.call(this, module || WeightedDirectedGraphTracer)) {
        initWeightedGraph();
        return true;
    }
    return false;
}

WeightedDirectedGraphTracer.prototype = Object.create(DirectedGraphTracer.prototype);
WeightedDirectedGraphTracer.prototype.constructor = WeightedDirectedGraphTracer;

// Override
WeightedDirectedGraphTracer.prototype.clear = function () {
    DirectedGraphTracer.prototype.clear.call(this);

    clearWeights();
};

var WeightedDirectedGraph = {
    random: function (N, ratio, min, max) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        if (!min) min = 1;
        if (!max) max = 5;
        var G = [];
        for (var i = 0; i < N; i++) {
            G.push([]);
            for (var j = 0; j < N; j++) {
                if (i == j) G[i].push(0);
                else if ((Math.random() * (1 / ratio) | 0) == 0) {
                    G[i].push((Math.random() * (max - min + 1) | 0) + min);
                } else {
                    G[i].push(0);
                }
            }
        }
        return G;
    }
};

// Override
WeightedDirectedGraphTracer.prototype._setData = function (G) {
    if (Tracer.prototype._setData.call(this, arguments)) return true;

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
            color: graphColor.default,
            weight: 0
        });
        for (var j = 0; j < G[i].length; j++) {
            if (G[i][j]) {
                edges.push({
                    id: e(i, j),
                    source: n(i),
                    target: n(j),
                    color: graphColor.default,
                    size: 1,
                    weight: G[i][j]
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

DirectedGraphTracer.prototype._weight = function (target, weight, delay) {
    this.pushStep({type: 'weight', target: target, weight: weight}, delay);
};

DirectedGraphTracer.prototype._visit = function (target, source, weight) {
    this.pushStep({type: 'visit', target: target, source: source, weight: weight}, true);
};

DirectedGraphTracer.prototype._leave = function (target, source, weight) {
    this.pushStep({type: 'leave', target: target, source: source, weight: weight}, true);
};

//Override
WeightedDirectedGraphTracer.prototype.processStep = function (step, options) {
    switch (step.type) {
        case 'weight':
            var targetNode = graph.nodes(n(step.target));
            if (step.weight !== undefined) targetNode.weight = step.weight;
            break;
        case 'visit':
        case 'leave':
            var visit = step.type == 'visit';
            var targetNode = graph.nodes(n(step.target));
            var color = visit ? graphColor.visited : graphColor.left;
            targetNode.color = color;
            if (step.weight !== undefined) targetNode.weight = step.weight;
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
        default:
            DirectedGraphTracer.prototype.processStep.call(this, step, options);
    }
};

var clearWeights = function () {
    graph.nodes().forEach(function (node) {
        node.weight = 0;
    });
};

var drawEdgeWeight = function (edge, source, target, color, context, settings) {
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
    }
    else {
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
};

var initWeightedGraph = function () {
    sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
        var color = getColor(edge, source, target, settings);
        drawArrow(edge, source, target, color, context, settings);
        drawEdgeWeight(edge, source, target, color, context, settings);
    };
    sigma.canvas.hovers.def = function (node, context, settings) {
        drawOnHover(node, context, settings, function (edge, source, target, color, context, settings) {
            drawEdgeWeight(edge, source, target, color, context, settings);
        });
    };
    sigma.canvas.labels.def = function (node, context, settings) {
        drawNodeWeight(node, context, settings);
        drawLabel(node, context, settings);
    }
};

var drawNodeWeight = function (node, context, settings) {
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
};