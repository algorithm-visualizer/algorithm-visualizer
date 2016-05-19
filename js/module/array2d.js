var $table = null;

function Array2DTracer(module) {
    if (Tracer.call(this, module || Array2DTracer)) {
        initTable();
        return true;
    }
    return false;
}

Array2DTracer.prototype = Object.create(Tracer.prototype);
Array2DTracer.prototype.constructor = Array2DTracer;

// Override
Array2DTracer.prototype.resize = function () {
    Tracer.prototype.resize.call(this);

    var $parent = $table.parent();
    $table.css('margin-top', $parent.height() / 2 - $table.height() / 2);
};

// Override
Array2DTracer.prototype.clear = function () {
    Tracer.prototype.clear.call(this);

    clearTableColor();
};

Array2DTracer.prototype.createRandomData = function (N, M, min, max) {
    if (!N) N = 10;
    if (!M) M = 10;
    if (min === undefined) min = 1;
    if (max === undefined) max = 9;
    var D = [];
    for (var i = 0; i < N; i++) {
        D.push([]);
        for (var j = 0; j < M; j++) {
            D[i].push((Math.random() * (max - min + 1) | 0) + min);
        }
    }
    return D;
};

// Override
Array2DTracer.prototype.setData = function (D) {
    if (Tracer.prototype.setData.call(this, arguments)) return true;

    $table.empty();
    for (var i = 0; i < D.length; i++) {
        var $row = $('<div class="mtbl-row">');
        $table.append($row);
        for (var j = 0; j < D[i].length; j++) {
            var $cell = $('<div class="mtbl-cell">').text(D[i][j]);
            $row.append($cell);
        }
    }
    this.resize();

    return false;
};

Array2DTracer.prototype._change = function (sx, sy, ex, ey) {
    if (sx instanceof Array) {
        this.pushStep({type: 'select', coords: sx, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', coords: sx}, false);
    } else if (ex !== undefined && ey !== undefined) {
        this.pushStep({type: 'select', sx: sx, sy: sy, ex: ex, ey: ey, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', sx: sx, sy: sy, ex: ex, ey: ey}, false);
    } else {
        this.pushStep({type: 'select', x: sx, y: sy, color: tableColor.changed}, true);
        this.pushStep({type: 'deselect', x: sx, y: sy}, false);
    }
};

Array2DTracer.prototype._changeRow = function (x, sy, ey) {
    this.pushStep({type: 'select', x: x, sy: sy, ey: ey, color: tableColor.changed}, true);
    this.pushStep({type: 'deselect', x: x, sy: sy, ey: ey}, false);
};

Array2DTracer.prototype._changeCol = function (y, sx, ex) {
    this.pushStep({type: 'select', y: y, sx: sx, ex: ex, color: tableColor.changed}, true);
    this.pushStep({type: 'deselect', y: y, sx: sx, ex: ex}, false);
};

Array2DTracer.prototype._select = function (sx, sy, ex, ey) {
    if (sx instanceof Array) {
        this.pushStep({type: 'select', coords: sx}, true);
    } else if (ex !== undefined && ey !== undefined) {
        this.pushStep({type: 'select', sx: sx, sy: sy, ex: ex, ey: ey}, true);
    } else {
        this.pushStep({type: 'select', x: sx, y: sy}, true);
    }
};

Array2DTracer.prototype._selectRow = function (x, sy, ey) {
    this.pushStep({type: 'select', x: x, sy: sy, ey: ey}, true);
};

Array2DTracer.prototype._selectCol = function (y, sx, ex) {
    this.pushStep({type: 'select', y: y, sx: sx, ex: ex}, true);
};

Array2DTracer.prototype._deselect = function (sx, sy, ex, ey) {
    if (sx instanceof Array) {
        this.pushStep({type: 'deselect', coords: sx}, true);
    } else if (ex !== undefined && ey !== undefined) {
        this.pushStep({type: 'deselect', sx: sx, sy: sy, ex: ex, ey: ey}, true);
    } else {
        this.pushStep({type: 'deselect', x: sx, y: sy}, true);
    }
};

Array2DTracer.prototype._deselectRow = function (x, sy, ey) {
    this.pushStep({type: 'deselect', x: x, sy: sy, ey: ey}, true);
};

Array2DTracer.prototype._deselectCol = function (y, sx, ex) {
    this.pushStep({type: 'deselect', y: y, sx: sx, ex: ex}, true);
};

Array2DTracer.prototype.processStep = function (step, options) {
    switch (step.type) {
        case 'select':
        case 'deselect':
            var select = step.type == 'select';
            var color = select ? step.color !== undefined ? step.color : tableColor.selected : tableColor.default;
            if (step.coords) {
                step.coords.forEach(function (coord) {
                    var x = coord.x;
                    var y = coord.y;
                    paintColor(x, y, x, y, color);
                });
            } else {
                var sx = step.sx;
                var sy = step.sy;
                var ex = step.ex;
                var ey = step.ey;
                if (sx === undefined) sx = step.x;
                if (sy === undefined) sy = step.y;
                if (ex === undefined) ex = step.x;
                if (ey === undefined) ey = step.y;
                paintColor(sx, sy, ex, ey, color);
            }
            break;
    }
};

// Override
Array2DTracer.prototype.prevStep = function () {
    this.clear();
    $('#tab_trace .wrapper').empty();
    var finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
        this.traceIndex = -1;
        return;
    }
    for (var i = 0; i < finalIndex; i++) {
        this.step(i, {virtual: true});
    }
    this.step(finalIndex);
};

var initTable = function () {
    $('.module_container').empty();
    $table = $('<div class="mtbl-table">');
    $('.module_container').append($table);
};

var tableColor = {
    selected: '#0ff',
    changed: '#f00',
    default: ''
};

var paintColor = function (sx, sy, ex, ey, color) {
    for (var i = sx; i <= ex; i++) {
        var $row = $table.find('.mtbl-row').eq(i);
        for (var j = sy; j <= ey; j++) {
            $row.find('.mtbl-cell').eq(j).css('background', color);
        }
    }
};

var clearTableColor = function () {
    $table.find('.mtbl-cell').css('background', '');
};