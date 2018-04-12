import React from 'react';
import { Seed } from '/core';
import * as Tracers from '/core/tracers';
import * as Datas from '/core/datas';
import { Tracer } from '/core/tracers';
import { Array1DRenderer, Array2DRenderer, ChartRenderer, GraphRenderer, LogRenderer, Renderer } from '/core/renderers';
import { Array1DData, Array2DData, ChartData, Data, GraphData, LogData } from '/core/datas';

Object.assign(window, Tracers);
Object.assign(window, Datas);

class TracerManager {
  constructor() {
    this.interval = 500;
    this.paused = false;
    this.started = false;
    this.lineIndicator = null;
    this.reset(new Seed());
  }

  setOnRender(onRender) {
    this.onRender = onRender;
  }

  setOnUpdateStatus(onUpdateStatus) {
    this.onUpdateStatus = onUpdateStatus;
  }

  setOnUpdateLineIndicator(onUpdateLineIndicator) {
    this.onUpdateLineIndicator = onUpdateLineIndicator;
  }

  setOnError(onError) {
    this.onError = onError;
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

  reset(seed) {
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
    const renderer = <RendererClass key={tracerKey} title={title} data={data} />;
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

  execute(data, code, callback) {
    try {
      const dataLines = data.split('\n');
      const codeLines = code.split('\n');
      const lines = [...dataLines, ...codeLines];
      const newLines = lines.map((line, i) => line.replace(/(.+\. *wait *)(\( *\))/g, `$1(${i - dataLines.length})`));
      const seed = new Seed();
      Tracer.seed = seed;
      eval(Babel.transform(newLines.join('\n'), { presets: ['es2015'] }).code);
      this.reset(seed);
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  runData(data) {
    this.execute(data, '', () => this.applyTraceChunk());
  }

  run(data, code) {
    const error = this.execute(data, code, () => this.resume());
    if (error) {
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
    this.reset(new Seed());
    if (this.onError) this.onError(error);
  }
}

const tracerManager = new TracerManager();
export default tracerManager;