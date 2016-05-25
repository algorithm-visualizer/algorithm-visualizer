function kruskal() {
    var vcount = G.length;

    // Preprocess: sort edges by weight.
    var edges = [];
    for (var vi = 0; vi < vcount - 1; vi++) {
        for (var vj = vi + 1; vj < vcount; vj++) {
            edges.push({
                0: vi,
                1: vj,
                weight: G[vi][vj]
            });
        }
    }
    edges.sort(function (ei, ej) {
        return ei.weight - ej.weight
    });

    // Give each vertex a tree to decide if they are already in the same tree.
    var t = [];
    for (var i = 0; i < vcount; i++) {
        t[i] = {};
        t[i][i] = true;
    }

    var wsum = 0;
    for (var n = 0; n < vcount - 1 && edges.length > 0;) {
        var e = edges.shift(); // Get the edge of min weight
        tracer._visit(e[0], e[1])._wait();
        if (t[e[0]] === t[e[1]]) {
            // e[0] & e[1] already in the same tree, ignore
            tracer._leave(e[0], e[1])._wait();
            continue;
        }

        // Choose the current edge.
        wsum += e.weight;

        // Merge tree of e[0] & e[1]
        var tmerged = {};
        for (i in t[e[0]]) tmerged[i] = true;
        for (i in t[e[1]]) tmerged[i] = true;
        for (i in tmerged) t[i] = tmerged;

        n += 1;
    }

    logger._print("The sum of all edges is: " + wsum);
}

kruskal();
