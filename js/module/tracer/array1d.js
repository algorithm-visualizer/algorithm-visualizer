'use strict';

const Array2DTracer = require('./array2d');

class Array1DTracer extends Array2DTracer {
  static getClassName() {
    return 'Array1DTracer';
  }

  constructor(name) {
    super(name);
  }

  _notify(idx, v) {
    super._notify(0, idx, v);
    return this;
  }

  _denotify(idx) {
    super._denotify(0, idx);
    return this;
  }

  _select(s, e) {
    if (e === undefined) {
      super._select(0, s);
    } else {
      super._selectRow(0, s, e);
    }
    return this;
  }

  _deselect(s, e) {
    if (e === undefined) {
      super._deselect(0, s);
    } else {
      super._deselectRow(0, s, e);
    }
    return this;
  }

  processStep(step, options) {
    super.processStep(step, options);
    if (this.chartTracer) {
      const newStep = $.extend(true, {}, step);
      newStep.capsule = this.chartTracer.capsule;
      newStep.s = newStep.y || newStep.sy;
      newStep.e = newStep.ey;
      delete newStep.x;
      delete newStep.y;
      delete newStep.sx;
      delete newStep.sy;
      delete newStep.ex;
      delete newStep.ey;
      this.chartTracer.processStep(newStep, options);
    }
  }

  setData(D) {
    return super.setData([D]);
  }
}

module.exports = Array1DTracer;
