function WeightedDirectedGraphTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        WeightedDirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedDirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: WeightedDirectedGraphTracer,
    init: function () {
        var tracer = this;

        this.s.settings({
            edgeLabelSize: 'proportional',
            defaultEdgeLabelSize: 20,
            edgeLabelSizePowRatio: 0.8,
            funcLabelsDef: function (node, context, settings) {
                tracer.drawNodeWeight(node, context, settings);
                tracer.drawLabel(node, context, settings);
            },
            funcHoversDef: function (node, context, settings) {
                tracer.drawOnHover(node, context, settings, tracer.drawEdgeWeight);
            },
            funcEdgesArrow: function (edge, source, target, context, settings) {
                var color = tracer.getColor(edge, source, target, settings);
                tracer.drawArrow(edge, source, target, color, context, settings);
                tracer.drawEdgeWeight(edge, source, target, color, context, settings);
            }
        });
    },
    _weight: function (target, weight) {
        this.manager.pushStep(this.capsule, {type: 'weight', target: target, weight: weight});
        return this;
    },
    _visit: function (target, source, weight) {
        this.manager.pushStep(this.capsule, {type: 'visit', target: target, source: source, weight: weight});
        return this;
    },
    _leave: function (target, source, weight) {
        this.manager.pushStep(this.capsule, {type: 'leave', target: target, source: source, weight: weight});
        return this;
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'weight':
                var targetNode = this.graph.nodes(this.n(step.target));
                if (step.weight !== undefined) targetNode.weight = TracerUtil.refineNumber(step.weight);
                break;
            case 'visit':
            case 'leave':
                var visit = step.type == 'visit';
                var targetNode = this.graph.nodes(this.n(step.target));
                var color = visit ? this.color.visited : this.color.left;
                targetNode.color = color;
                if (step.weight !== undefined) targetNode.weight = TracerUtil.refineNumber(step.weight);
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
                DirectedGraphTracer.prototype.processStep.call(this, step, options);
        }
    },
    setData: function (G) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;

        this.graph.clear();
        var nodes = [];
        var edges = [];
        var unitAngle = 2 * Math.PI / G.length;
        var currentAngle = 0;
        for (var i = 0; i < G.length; i++) {
            currentAngle += unitAngle;
            nodes.push({
                id: this.n(i),
                label: '' + i,
                x: .5 + Math.sin(currentAngle) / 2,
                y: .5 + Math.cos(currentAngle) / 2,
                size: 1,
                color: this.color.default,
                weight: 0
            });
            for (var j = 0; j < G[i].length; j++) {
                if (G[i][j]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
                        size: 1,
                        weight: TracerUtil.refineNumber(G[i][j])
                    });
                }
            }
        }

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
    clear: function () {
        DirectedGraphTracer.prototype.clear.call(this);

        this.clearWeights();
    },
    clearWeights: function () {
        this.graph.nodes().forEach(function (node) {
            node.weight = 0;
        });
    },
    drawEdgeWeight: function (edge, source, target, color, context, settings) {
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
    },
    drawNodeWeight: function (node, context, settings) {
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
});

var WeightedDirectedGraph = {
    random: function (N, ratio, min, max) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        if (!min) min = 1;
        if (!max) max = 5;
        var G = new Array(N);
        for (var i = 0; i < N; i++) {
            G[i] = new Array(N);
            for (var j = 0; j < N; j++) {
                if (i != j && (Math.random() * (1 / ratio) | 0) == 0) {
                    G[i][j] = (Math.random() * (max - min + 1) | 0) + min;
                }
            }
        }
        return G;
    }
};