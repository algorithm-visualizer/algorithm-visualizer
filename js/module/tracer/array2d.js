'use strict';

const Tracer = require('./tracer');

const {
  refineByType
} = require('../../tracer_manager/util/index');

class Array2DTracer extends Tracer {
  static getClassName() {
    return 'Array2DTracer';
  }

  constructor(name) {
    super(name);

    if (this.isNew) initView(this);
  }

  _notify(x, y, v) {
    this.manager.pushStep(this.capsule, {
      type: 'notify',
      x: x,
      y: y,
      v: v
    });
    return this;
  }

  _denotify(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'denotify',
      x: x,
      y: y
    });
    return this;
  }

  _select(sx, sy, ex, ey) {
    this.pushSelectingStep('select', null, arguments);
    return this;
  }

  _selectRow(x, sy, ey) {
    this.pushSelectingStep('select', 'row', arguments);
    return this;
  }

  _selectCol(y, sx, ex) {
    this.pushSelectingStep('select', 'col', arguments);
    return this;
  }

  _deselect(sx, sy, ex, ey) {
    this.pushSelectingStep('deselect', null, arguments);
    return this;
  }

  _deselectRow(x, sy, ey) {
    this.pushSelectingStep('deselect', 'row', arguments);
    return this;
  }

  _deselectCol(y, sx, ex) {
    this.pushSelectingStep('deselect', 'col', arguments);
    return this;
  }

  _separate(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'separate',
      x: x,
      y: y
    });
    return this;
  }

  _separateRow(x) {
    this._separate(x, -1);
    return this;
  }

  _separateCol(y) {
    this._separate(-1, y);
    return this;
  }

  _deseparate(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'deseparate',
      x: x,
      y: y
    });
    return this;
  }

  _deseparateRow(x) {
    this._deseparate(x, -1);
    return this;
  }

  _deseparateCol(y) {
    this._deseparate(-1, y);
    return this;
  }

  pushSelectingStep() {
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
    this.manager.pushStep(this.capsule, step);
  }

  processStep(step, options) {
    switch (step.type) {
      case 'notify':
        if (step.v !== undefined) {
          var $row = this.$table.find('.mtbl-row').eq(step.x);
          var $col = $row.find('.mtbl-col').eq(step.y);
          $col.text(refineByType(step.v));
        }
      case 'denotify':
      case 'select':
      case 'deselect':
        var color = step.type == 'select' || step.type == 'deselect' ? this.color.selected : this.color.notified;
        var paint = step.type == 'select' || step.type == 'notify';
        var sx = step.sx;
        var sy = step.sy;
        var ex = step.ex;
        var ey = step.ey;
        if (sx === undefined) sx = step.x;
        if (sy === undefined) sy = step.y;
        if (ex === undefined) ex = step.x;
        if (ey === undefined) ey = step.y;
        this.paintColor(sx, sy, ex, ey, color, paint);
        break;
      case 'separate':
        this.deseparate(step.x, step.y);
        this.separate(step.x, step.y);
        break;
      case 'deseparate':
        this.deseparate(step.x, step.y);
        break;
      default:
        super.processStep(step, options);
    }
  }

  setData(D) {
    this.viewX = this.viewY = 0;
    this.paddingH = 6;
    this.paddingV = 3;
    this.fontSize = 16;

    if (super.setData.apply(this, arguments)) {
      this.$table.find('.mtbl-row').each(function (i) {
        $(this).find('.mtbl-col').each(function (j) {
          $(this).text(refineByType(D[i][j]));
        });
      });
      return true;
    }

    this.$table.empty();
    for (var i = 0; i < D.length; i++) {
      var $row = $('<div class="mtbl-row">');
      this.$table.append($row);
      for (var j = 0; j < D[i].length; j++) {
        var $col = $('<div class="mtbl-col">')
          .css(this.getCellCss())
          .text(refineByType(D[i][j]));
        $row.append($col);
      }
    }
    this.resize();

    return false;
  }

  resize() {
    super.resize();

    this.refresh();
  }

  clear() {
    super.clear();

    this.clearColor();
    this.deseparateAll();
  }

  getCellCss() {
    return {
      padding: this.paddingV.toFixed(1) + 'px ' + this.paddingH.toFixed(1) + 'px',
      'font-size': this.fontSize.toFixed(1) + 'px'
    };
  }

  refresh() {
    super.refresh();

    var $parent = this.$table.parent();
    var top = $parent.height() / 2 - this.$table.height() / 2 + this.viewY;
    var left = $parent.width() / 2 - this.$table.width() / 2 + this.viewX;
    this.$table.css('margin-top', top);
    this.$table.css('margin-left', left);
  }

  mousedown(e) {
    super.mousedown(e);

    this.dragX = e.pageX;
    this.dragY = e.pageY;
    this.dragging = true;
  }

  mousemove(e) {
    super.mousemove(e);

    if (this.dragging) {
      this.viewX += e.pageX - this.dragX;
      this.viewY += e.pageY - this.dragY;
      this.dragX = e.pageX;
      this.dragY = e.pageY;
      this.refresh();
    }
  }

  mouseup(e) {
    super.mouseup(e);

    this.dragging = false;
  }

  mousewheel(e) {
    super.mousewheel(e);

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
    this.$table.find('.mtbl-col').css(this.getCellCss());
    this.refresh();
  }

  paintColor(sx, sy, ex, ey, color, paint) {
    for (var i = sx; i <= ex; i++) {
      var $row = this.$table.find('.mtbl-row').eq(i);
      for (var j = sy; j <= ey; j++) {
        var $col = $row.find('.mtbl-col').eq(j);
        if (paint) $col.css('background', color);
        else $col.css('background', '');
      }
    }
  }

  clearColor() {
    this.$table.find('.mtbl-col').css('background', '');
  }

  separate(x, y) {
    this.$table.find('.mtbl-row').each(function (i) {
      var $row = $(this);
      if (i == x) {
        $row.after($('<div class="mtbl-empty-row">').attr('data-row', i))
      }
      $row.find('.mtbl-col').each(function (j) {
        var $col = $(this);
        if (j == y) {
          $col.after($('<div class="mtbl-empty-col">').attr('data-col', j));
        }
      });
    });
  }

  deseparate(x, y) {
    this.$table.find('[data-row=' + x + ']').remove();
    this.$table.find('[data-col=' + y + ']').remove();
  }

  deseparateAll() {
    this.$table.find('.mtbl-empty-row, .mtbl-empty-col').remove();
  }
}

const initView = (tracer) => {
  tracer.$table = tracer.capsule.$table = $('<div class="mtbl-table">');
  tracer.$container.append(tracer.$table);
};

module.exports = Array2DTracer;
