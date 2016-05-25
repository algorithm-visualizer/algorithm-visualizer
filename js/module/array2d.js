function Array2DTracer() {
    if (Tracer.apply(this, arguments)) {
        Array2DTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

Array2DTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: Array2DTracer,
    init: function () {
        this.$table = this.capsule.$table = $('<div class="mtbl-table">');
        this.$container.append(this.$table);
    },
    _notify: function (x, y, v) {
        tm.pushStep(this.capsule, {
            type: 'notify',
            x: x,
            y: y,
            v: v
        });
        return this;
    },
    _denotify: function (x, y) {
        tm.pushStep(this.capsule, {
            type: 'denotify',
            x: x,
            y: y
        });
        return this;
    },
    _select: function (sx, sy, ex, ey) {
        this.pushSelectingStep('select', null, arguments);
        return this;
    },
    _selectRow: function (x, sy, ey) {
        this.pushSelectingStep('select', 'row', arguments);
        return this;
    },
    _selectCol: function (y, sx, ex) {
        this.pushSelectingStep('select', 'col', arguments);
        return this;
    },
    _deselect: function (sx, sy, ex, ey) {
        this.pushSelectingStep('deselect', null, arguments);
        return this;
    },
    _deselectRow: function (x, sy, ey) {
        this.pushSelectingStep('deselect', 'row', arguments);
        return this;
    },
    _deselectCol: function (y, sx, ex) {
        this.pushSelectingStep('deselect', 'col', arguments);
        return this;
    },
    pushSelectingStep: function () {
        var args = Array.prototype.slice.call(arguments);
        var type = args.shift();
        var mode = args.shift();
        args = Array.prototype.slice.call(args.shift());
        var coord;
        switch (mode) {
            case 'row':
                coord = {
                    x: args[0],
                    sy: args[1],
                    ey: args[2]
                };
                break;
            case 'col':
                coord = {
                    y: args[0],
                    sx: args[1],
                    ex: args[2]
                };
                break;
            default:
                if (args[2] === undefined && args[3] === undefined) {
                    coord = {
                        x: args[0],
                        y: args[1]
                    };
                } else {
                    coord = {
                        sx: args[0],
                        sy: args[1],
                        ex: args[2],
                        ey: args[3]
                    };
                }
        }
        var step = {
            type: type
        };
        $.extend(step, coord);
        tm.pushStep(this.capsule, step);
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'notify':
                if (step.v) {
                    var $row = this.$table.find('.mtbl-row').eq(step.x);
                    $row.find('.mtbl-cell').eq(step.y).text(refineNumber(step.v));
                }
            case 'denotify':
            case 'select':
            case 'deselect':
                var colorClass = step.type == 'select' || step.type == 'deselect' ? this.colorClass.selected : this.colorClass.notified;
                var addClass = step.type == 'select' || step.type == 'notify';
                var sx = step.sx;
                var sy = step.sy;
                var ex = step.ex;
                var ey = step.ey;
                if (sx === undefined) sx = step.x;
                if (sy === undefined) sy = step.y;
                if (ex === undefined) ex = step.x;
                if (ey === undefined) ey = step.y;
                this.paintColor(sx, sy, ex, ey, colorClass, addClass);
                break;
            default:
                Tracer.prototype.processStep.call(this, step, options);
        }
    },
    setData: function (D) {
        this.viewX = this.viewY = 0;
        this.paddingH = 6;
        this.paddingV = 3;
        this.fontSize = 16;

        if (Tracer.prototype.setData.apply(this, arguments)) {
            this.$table.find('.mtbl-row').each(function (i) {
                $(this).children().each(function (j) {
                    $(this).text(refineNumber(D[i][j]));
                });
            });
            return true;
        }

        this.$table.empty();
        for (var i = 0; i < D.length; i++) {
            var $row = $('<div class="mtbl-row">');
            this.$table.append($row);
            for (var j = 0; j < D[i].length; j++) {
                var $cell = $('<div class="mtbl-cell">')
                    .css(this.getCellCss())
                    .text(refineNumber(D[i][j]));
                $row.append($cell);
            }
        }
        this.resize();

        return false;
    },
    resize: function () {
        Tracer.prototype.resize.call(this);

        this.refresh();
    },
    clear: function () {
        Tracer.prototype.clear.call(this);

        this.clearColor();
    },
    getCellCss: function () {
        return {
            padding: this.paddingV.toFixed(1) + 'px ' + this.paddingH.toFixed(1) + 'px',
            'font-size': this.fontSize.toFixed(1) + 'px'
        };
    },
    refresh: function () {
        Tracer.prototype.refresh.call(this);

        var $parent = this.$table.parent();
        var top = $parent.height() / 2 - this.$table.height() / 2 + this.viewY;
        var left = $parent.width() / 2 - this.$table.width() / 2 + this.viewX;
        this.$table.css('margin-top', top);
        this.$table.css('margin-left', left);
    },
    mousedown: function (e) {
        Tracer.prototype.mousedown.call(this, e);

        this.dragX = e.pageX;
        this.dragY = e.pageY;
        this.dragging = true;
    },
    mousemove: function (e) {
        Tracer.prototype.mousemove.call(this, e);

        if (this.dragging) {
            this.viewX += e.pageX - this.dragX;
            this.viewY += e.pageY - this.dragY;
            this.dragX = e.pageX;
            this.dragY = e.pageY;
            this.refresh();
        }
    },
    mouseup: function (e) {
        Tracer.prototype.mouseup.call(this, e);

        this.dragging = false;
    },
    mousewheel: function (e) {
        Tracer.prototype.mousewheel.call(this, e);

        e.preventDefault();
        e = e.originalEvent;
        var delta = (e.wheelDelta !== undefined && e.wheelDelta) ||
            (e.detail !== undefined && -e.detail);
        var weight = 1.01;
        var ratio = delta > 0 ? 1 / weight : weight;
        if (this.fontSize < 4 && ratio < 1) return;
        if (this.fontSize > 40 && ratio > 1) return;
        this.paddingV *= ratio;
        this.paddingH *= ratio;
        this.fontSize *= ratio;
        this.$table.find('.mtbl-cell').css(this.getCellCss());
        this.refresh();
    },
    paintColor: function (sx, sy, ex, ey, colorClass, addClass) {
        for (var i = sx; i <= ex; i++) {
            var $row = this.$table.find('.mtbl-row').eq(i);
            for (var j = sy; j <= ey; j++) {
                var $cell = $row.find('.mtbl-cell').eq(j);
                if (addClass) $cell.addClass(colorClass);
                else $cell.removeClass(colorClass);
            }
        }
    },
    clearColor: function () {
        this.$table.find('.mtbl-cell').removeClass(Object.keys(this.colorClass).join(' '));
    },
    colorClass: {
        selected: 'selected',
        notified: 'notified'
    }
});

var Array2D = {
    random: function (N, M, min, max) {
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
    },
    randomSorted: function (N, M, min, max) {
        return this.random(N, M, min, max).map(function (arr) {
            return arr.sort(function (a, b) {
                return a - b;
            });
        });
    }
};