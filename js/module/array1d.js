function Array1DTracer(module) {
    return Array2DTracer.call(this, module || Array1DTracer);
}

Array1DTracer.prototype = $.extend(true, Object.create(Array2DTracer.prototype), {
    constructor: Array1DTracer,
    _notify: function (idx1, idx2) {
        if (idx2 === undefined) {
            Array2DTracer.prototype._notify.call(this, 0, idx1);
        } else {
            Array2DTracer.prototype._notify.call(this, 0, idx1, 0, idx2);
        }
    },
    _select: function (s, e) {
        if (e === undefined) {
            Array2DTracer.prototype._select.call(this, 0, s);
        } else {
            Array2DTracer.prototype._selectRow.call(this, 0, s, e);
        }
    },
    _selectSet: function (indexes) {
        var coords = [];
        indexes.forEach(function (index) {
            coords.push({
                x: 0,
                y: index
            });
        });
        Array2DTracer.prototype._selectSet.call(this, coords);
    },
    _deselect: function (s, e) {
        if (e === undefined) {
            Array2DTracer.prototype._deselect.call(this, 0, s);
        } else {
            Array2DTracer.prototype._deselectRow.call(this, 0, s, e);
        }
    },
    _deselectSet: function (indexes) {
        var coords = [];
        indexes.forEach(function (index) {
            coords.push({
                x: 0,
                y: index
            });
        });
        Array2DTracer.prototype._deselectSet.call(this, coords);
    },
    setData: function (D) {
        return Array2DTracer.prototype.setData.call(this, [D]);
    }
});

var Array1D = {
    random: function (N, min, max) {
        return Array2D.random(1, N, min, max)[0];
    },
    randomSorted: function (N, min, max) {
        return Array2D.randomSorted(1, N, min, max)[0];
    }
};