var s = null, graph = null, sigmaCanvas = null;

function DirectedGraphTracer(module) {
    if (Tracer.call(this, module || DirectedGraphTracer)) {
        DirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

DirectedGraphTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: DirectedGraphTracer,
    init: function () {
        var tracer = this;

        if (sigmaCanvas == null) {
            sigmaCanvas = $.extend(true, {}, sigma.canvas);
        } else {
            sigma.canvas = $.extend(true, {}, sigmaCanvas);
        }
        s = new sigma({
            renderer: {
                container: $module_container[0],
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
        sigma.canvas.labels.def = function (node, context, settings) {
            tracer.drawLabel(node, context, settings);
        };
        sigma.canvas.hovers.def = function (node, context, settings, next) {
            tracer.drawOnHover(node, context, settings, next);
        };
        sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
            var color = tracer.getColor(edge, source, target, settings);
            tracer.drawArrow(edge, source, target, color, context, settings);
        };
        sigma.plugins.dragNodes(s, s.renderers[0]);
    },
    resize: function () {
        Tracer.prototype.resize.call(this);

        this.refresh();
    },
    clear: function () {
        Tracer.prototype.clear.call(this);

        this.clearGraphColor();
    },
    _setTreeData: function (G, root) {
        var tracer = this;

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

        if (this._setData(G, root)) return true;

        var place = function (node, x, y) {
            var temp = graph.nodes(tracer.n(node));
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
    },
    _setData: function (G) {
        if (Tracer.prototype._setData.call(this, arguments)) return true;

        graph.clear();
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
                color: this.color.default
            });
            for (var j = 0; j < G[i].length; j++) {
                if (G[i][j]) {
                    edges.push({
                        id: this.e(i, j),
                        source: this.n(i),
                        target: this.n(j),
                        color: this.color.default,
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
    },
    _visit: function (target, source) {
        this.pushStep({type: 'visit', target: target, source: source}, true);
    },
    _leave: function (target, source) {
        this.pushStep({type: 'leave', target: target, source: source}, true);
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'visit':
            case 'leave':
                var visit = step.type == 'visit';
                var targetNode = graph.nodes(this.n(step.target));
                var color = visit ? this.color.visited : this.color.left;
                targetNode.color = color;
                if (step.source !== undefined) {
                    var edgeId = this.e(step.source, step.target);
                    var edge = graph.edges(edgeId);
                    edge.color = color;
                    graph.dropEdge(edgeId).addEdge(edge);
                }
                var source = step.source;
                if (source === undefined) source = '';
                this.printTrace(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
                break;
        }
    },
    refresh: function () {
        Tracer.prototype.refresh.call(this);

        s.refresh();
    },
    prevStep: function () {
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
    },
    color: {
        visited: '#f00',
        left: '#000',
        default: '#888'
    },
    clearGraphColor: function () {
        var tracer = this;

        graph.nodes().forEach(function (node) {
            node.color = tracer.color.default;
        });
        graph.edges().forEach(function (edge) {
            edge.color = tracer.color.default;
        });
    },
    n: function (v) {
        return 'n' + v;
    },
    e: function (v1, v2) {
        return 'e' + v1 + '_' + v2;
    },
    getColor: function (edge, source, target, settings) {
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
    },
    drawLabel: function (node, context, settings) {
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
    },
    drawArrow: function (edge, source, target, color, context, settings) {
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
    },
    drawOnHover: function (node, context, settings, next) {
        var tracer = this;

        var nodeIdx = node.id.substring(1);
        graph.edges().forEach(function (edge) {
            var ends = edge.id.substring(1).split("_");
            context.setLineDash([5, 5]);
            if (ends[0] == nodeIdx) {
                var color = '#0ff';
                var source = node;
                var target = graph.nodes('n' + ends[1]);
                tracer.drawArrow(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            } else if (ends[1] == nodeIdx) {
                var color = '#ff0';
                var source = graph.nodes('n' + ends[0]);
                var target = node;
                tracer.drawArrow(edge, source, target, color, context, settings);
                if (next) next(edge, source, target, color, context, settings);
            }
        });
    }
});

var DirectedGraph = {
    random: function (N, ratio) {
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
    }
};