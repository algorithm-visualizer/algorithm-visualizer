function UndirectedGraphTracer(module) {
    if (DirectedGraphTracer.call(this, module || UndirectedGraphTracer)) {
        UndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

UndirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: UndirectedGraphTracer,
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
                color: this.color.default
            });
        }
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j <= i; j++) {
                if (G[i][j] || G[j][i]) {
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

var UndirectedGraph = {
    random: function (N, ratio) {
        if (!N) N = 5;
        if (!ratio) ratio = .3;
        var G = new Array(N);
        for (var i = 0; i < N; i++) G[i] = new Array(N);
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (i > j) {
                    G[i][j] = G[j][i] = (Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0;
                }
            }
        }
        return G;
    }
};