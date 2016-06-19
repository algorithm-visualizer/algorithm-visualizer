'use strict';

const app = require('../../app');

const {
  toJSON,
  fromJSON
} = require('../../tracer_manager/util/index');

class Tracer {
  static getClassName() {
    return 'Tracer';
  }

  constructor(name) {
    this.module = this.constructor;

    this.selectColor;
    this.notifyColor;
    this.defaultColor;
    this.leftColor;
    this.visitedColor;

    this.manager = app.getTracerManager();
    this.capsule = this.manager.allocate(this);
    $.extend(this, this.capsule);

    this.setName(name);
  }

  _setData(...args) {
    this.manager.pushStep(this.capsule, {
      type: 'setData',
      args: toJSON(args)
    });
    return this;
  }

  _clear() {
    this.manager.pushStep(this.capsule, {
      type: 'clear'
    });
    return this;
  }

  _wait(line) {
    this.manager.newStep(line);
    return this;
  }

  _setSelectFillColor(c) {
    this.selectColor = c;
  }

  _setNotifyFillColor(c) {
    this.notifyColor = c;
  }

  _setDefaultFillColor(c){
    this.defaultColor = c;
  }

  _setLeftFillColor(c){
    this.leftColor = c;
  }

  _setVisitedFillColor(c){
    this.visitedColor = c;
  }

  processStep(step, options) {
    const {
      type,
      args
    } = step;

    switch (type) {
      case 'setData':
        this.setData(...fromJSON(args));
        break;
      case 'clear':
        this.clear();
        break;
    }
  }

  setName(name) {
    let $name;
    if (this.isNew) {
      $name = $('<span class="name">');
      this.$container.append($name);
    } else {
      $name = this.$container.find('span.name');
    }
    $name.text(name || this.defaultName);
  }

  setData() {
    const data = toJSON(arguments);
    if (!this.isNew && this.lastData === data) {
      return true;
    }
    this.lastData = this.capsule.lastData = data;
    return false;
  }

  resize() {
  }

  refresh() {
  }

  clear() {
  }

  attach(tracer) {
    switch (tracer.module) {
      case LogTracer:
        this.logTracer = tracer;
        break;
      case ChartTracer:
        this.chartTracer = tracer;
        break;
    }
    return this;
  }

  mousedown(e) {
  }

  mousemove(e) {
  }

  mouseup(e) {
  }

  mousewheel(e) {
  }
}

module.exports = Tracer;
