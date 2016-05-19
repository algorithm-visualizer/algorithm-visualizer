function Array1DTracer(module) {
    return Array2DTracer.call(this, module || Array1DTracer);
}

Array1DTracer.prototype = Object.create(Array2DTracer.prototype);
Array1DTracer.prototype.constructor = Array1DTracer;

// Override
Array1DTracer.prototype.createRandomData = function (N, min, max) {
    return Array2DTracer.prototype.createRandomData.call(this, 1, N, min, max)[0];
};

// Override
Array1DTracer.prototype.setData = function (D) {
    return Array2DTracer.prototype.setData.call(this, [D]);
};

// Override
Array1DTracer.prototype._change = function (s, e) {
    if (s instanceof Array) {
        this.pushStep({type: 'select', indexes: s, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', indexes: s}, false);
    } else if (e !== undefined) {
        this.pushStep({type: 'select', index: s, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', index: s}, false);
    } else {
        this.pushStep({type: 'select', s: s, e: e, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', s: s, e: e}, false);
    }
};

// Override
Array1DTracer.prototype._select = function (s, e) {
    if (s instanceof Array) {
        this.pushStep({type: 'select', indexes: s}, true);
    } else if (e !== undefined) {
        this.pushStep({type: 'select', index: s}, true);
    } else {
        this.pushStep({type: 'select', s: s, e: e}, true);
    }
};

// Override
Array1DTracer.prototype._deselect = function (s, e) {
    if (s instanceof Array) {
        this.pushStep({type: 'deselect', indexes: s}, true);
    } else if (e !== undefined) {
        this.pushStep({type: 'deselect', index: s}, true);
    } else {
        this.pushStep({type: 'deselect', s: s, e: e}, true);
    }
};

// Override
Array1DTracer.prototype.processStep = function (step, options) {
    switch (step.type) {
        case 'select':
        case 'deselect':
            var select = step.type == 'select';
            var color = select ? step.color !== undefined ? step.color : tableColor.selected : tableColor.default;
            if (step.indexes) {
                step.indexes.forEach(function (index) {
                    paintColor(0, index, 0, index, color);
                });
            } else {
                var s = step.s;
                var e = step.e;
                if (s === undefined) s = step.index;
                if (e === undefined) e = step.index;
                paintColor(0, s, 0, e, color);
            }
            break;
    }
};