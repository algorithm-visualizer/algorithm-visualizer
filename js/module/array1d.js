function Array1DTracer(module) {
    return Array2DTracer.call(this, module || Array1DTracer);
}

Array1DTracer.prototype = Object.create(Array2DTracer.prototype);
Array1DTracer.prototype.constructor = Array1DTracer;

var Array1D = {
    createRandomData: function (N, min, max) {
        return Array2D.createRandomData(1, N, min, max)[0];
    }
};

// Override
Array1DTracer.prototype._setData = function (D) {
    return Array2DTracer.prototype._setData.call(this, [D]);
};

// Override
Array1DTracer.prototype._notify = function (idx1, idx2) {
    if (idx2 === undefined) {
        Array2DTracer.prototype._notify.call(this, 0, idx1);
    } else {
        Array2DTracer.prototype._notify.call(this, 0, idx1, 0, idx2);
    }
};

// Override
Array1DTracer.prototype._select = function (s, e) {
    if (e === undefined) {
        Array2DTracer.prototype._select.call(this, 0, s);
    } else {
        Array2DTracer.prototype._selectRow.call(this, 0, s, e);
    }
};

// Override
Array1DTracer.prototype._selectSet = function (indexes) {
    var coords = [];
    indexes.forEach(function (index) {
        coords.push({x: 0, y: index});
    });
    Array2DTracer.prototype._selectSet.call(this, coords);
};

// Override
Array1DTracer.prototype._deselect = function (s, e) {
    if (e === undefined) {
        Array2DTracer.prototype._deselect.call(this, 0, s);
    } else {
        Array2DTracer.prototype._deselectRow.call(this, 0, s, e);
    }
};

// Override
Array1DTracer.prototype._deselectSet = function (indexes) {
    var coords = [];
    indexes.forEach(function (index) {
        coords.push({x: 0, y: index});
    });
    Array2DTracer.prototype._deselectSet.call(this, coords);
};