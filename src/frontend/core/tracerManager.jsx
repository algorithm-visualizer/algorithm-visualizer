import React from 'react';
import { Randomize, Seed } from '/core';
import * as Tracers from '/core/tracers';
import { Tracer } from '/core/tracers';
import * as Datas from '/core/datas';
import { Array1DData, Array2DData, ChartData, Data, GraphData, LogData } from '/core/datas';
import { Array1DRenderer, Array2DRenderer, ChartRenderer, GraphRenderer, LogRenderer, Renderer } from '/core/renderers';

Object.assign(window, Tracers);
Object.assign(window, Datas);
Object.assign(window, { Randomize });

class TracerManager {
  constructor() {
    this.interval = 500;
    this.paused = false;
    this.started = false;
    this.lineIndicator = null;
    this.code = '';
    this.reset();
  }

  setOnRender(onRender) {
    this.onRender = onRender;
    this.render();
  }

  setOnUpdateStatus(onUpdateStatus) {
    this.onUpdateStatus = onUpdateStatus;
    if (this.onUpdateStatus) {
      const { interval, paused, started } = this;
      this.onUpdateStatus({ interval, paused, started });
    }
  }

  setOnUpdateLineIndicator(onUpdateLineIndicator) {
    this.onUpdateLineIndicator = onUpdateLineIndicator;
    if (this.onUpdateLineIndicator) this.onUpdateLineIndicator(this.lineIndicator);
  }

  setOnError(onError) {
    this.onError = onError;
  }

  setOnUpdateCode(onUpdateCode) {
    this.onUpdateCode = onUpdateCode;
    if (this.onUpdateCode) this.onUpdateCode(this.code);
  }

  render() {
    if (this.onRender) this.onRender(this.renderers);
  }

  setInterval(interval) {
    this.interval = interval;
    if (this.onUpdateStatus) this.onUpdateStatus({ interval });
  }

  setPaused(paused) {
    this.paused = paused;
    if (this.onUpdateStatus) this.onUpdateStatus({ paused });
  }

  setStarted(started) {
    this.started = started;
    if (this.onUpdateStatus) this.onUpdateStatus({ started });
  }

  setLineIndicator(lineIndicator) {
    this.lineIndicator = lineIndicator;
    if (this.onUpdateLineIndicator) this.onUpdateLineIndicator(lineIndicator);
  }

  setCode(code) {
    this.code = code;
    this.runInitial();
    if (this.onUpdateCode) this.onUpdateCode(code);
  }

  reset(seed = new Seed()) {
    this.traces = seed.traces;
    this.resetCursor();
    this.stopTimer();
    this.setPaused(false);
    this.setStarted(false);
    this.setLineIndicator(null);
  }

  resetCursor() {
    this.renderers = [];
    this.datas = {};
    this.cursor = 0;
    this.chunkCursor = 0;
  }

  addTracer(className, tracerKey, title, options) {
    const [DataClass, RendererClass] = {
      Tracer: [Data, Renderer],
      LogTracer: [LogData, LogRenderer],
      Array2DTracer: [Array2DData, Array2DRenderer],
      Array1DTracer: [Array1DData, Array1DRenderer],
      ChartTracer: [ChartData, ChartRenderer],
      GraphTracer: [GraphData, GraphRenderer],
    }[className];
    const data = new DataClass(options);
    this.datas[tracerKey] = data;
    const renderer = {
      tracerKey,
      element: <RendererClass title={title} data={data} wsProps={{ fixed: true }} />
    };
    this.renderers.push(renderer);
  }

  applyTrace() {
    if (this.cursor >= this.traces.length) return false;
    const trace = this.traces[this.cursor++];
    const { tracerKey, method, args } = trace;
    try {
      if (method === 'construct') {
        const [className, title, options] = args;
        this.addTracer(className, tracerKey, title, options);
        return true;
      } else {
        const data = this.datas[tracerKey];
        const wait = method === 'wait';
        const newArgs = [...args];
        if (wait) {
          const lineNumber = newArgs.shift();
          this.setLineIndicator({ lineNumber, cursor: this.cursor });
        }
        data[method](...newArgs);
        return !wait;
      }
    } catch (error) {
      if (this.started) this.handleError(error);
      return false;
    }
  }

  applyTraceChunk(render = true) {
    if (this.cursor >= this.traces.length) return false;
    while (this.applyTrace()) ;
    this.chunkCursor++;
    if (render) this.render();
    return true;
  }

  startTimer() {
    this.stopTimer();
    if (this.applyTraceChunk()) {
      this.timer = window.setTimeout(() => this.startTimer(), this.interval);
    } else {
      this.setPaused(false);
      this.setStarted(false);
    }
  }

  stopTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  execute(callback) {
    try {
      const lines = this.code.split('\n').map((line, i) => line.replace(/(.+\. *wait *)(\( *\))/g, `$1(${i})`));
      const seed = new Seed();
      Tracer.seed = seed;
      eval(Babel.transform(lines.join('\n'), { presets: ['es2015'] }).code);
      this.reset(seed);
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  runInitial() {
    const error = this.execute(() => this.applyTraceChunk());
    if (error) {
      this.reset();
      this.render();
    }
  }

  run() {
    const error = this.execute(() => this.resume());
    if (error) {
      this.reset();
      this.render();
      this.handleError(error);
    } else {
      this.setStarted(true);
    }
  }

  prev() {
    this.pause();
    const lastChunk = Math.max(this.chunkCursor - 1, 1);
    this.resetCursor();
    while (this.chunkCursor < lastChunk) {
      this.applyTraceChunk(false);
    }
    this.render();
  }

  resume() {
    this.startTimer();
    this.setPaused(false);
  }

  pause() {
    this.stopTimer();
    this.setPaused(true);
  }

  next() {
    this.pause();
    this.applyTraceChunk();
  }

  handleError(error) {
    console.error(error);
    if (this.onError) this.onError(error);
  }
}

const tracerManager = new TracerManager();
export default tracerManager;