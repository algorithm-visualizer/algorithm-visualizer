WeightedGraphTracer.graphMode = "weighted";

function WeightedGraphTracer(module) {
    if (GraphTracer.call(this, module || WeightedGraphTracer)) {
        initWeightedGraph();
        return true;
    }
    return false;
}

WeightedGraphTracer.prototype = Object.create(GraphTracer.prototype);
WeightedGraphTracer.prototype.constructor = WeightedGraphTracer;

// Override
WeightedGraphTracer.prototype.setData = function (G) {
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

var initWeightedGraph = function () {
};