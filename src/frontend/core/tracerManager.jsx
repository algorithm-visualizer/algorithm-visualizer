import React from 'react';
import Promise from 'bluebird';
import { extension } from '/common/util';
import { Array1DData, Array2DData, ChartData, Data, GraphData, LogData } from '/core/datas';
import { Array1DRenderer, Array2DRenderer, ChartRenderer, GraphRenderer, LogRenderer, Renderer } from '/core/renderers';
import { CompilerApi } from '/apis';

class TracerManager {
  constructor() {
    this.interval = 500;
    this.paused = false;
    this.started = false;
    this.lineIndicator = null;
    this.file = { name: '', content: '', contributors: [] };
    this.reset();
  }

  setOnChangeRenderers(onChangeRenderers) {
    this.onChangeRenderers = onChangeRenderers;
    if (this.onChangeRenderers) this.onChangeRenderers(this.renderers);
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

  render() {
    Object.values(this.datas).forEach(data => data.render());
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

  setFile(file) {
    this.file = file;
    this.runInitial();
  }

  reset(traces = []) {
    this.traces = traces;
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
    if (this.onChangeRenderers) this.onChangeRenderers(this.renderers);
  }

  addTracer(className, tracerKey, title) {
    const [DataClass, RendererClass] = {
      Tracer: [Data, Renderer],
      LogTracer: [LogData, LogRenderer],
      Array2DTracer: [Array2DData, Array2DRenderer],
      Array1DTracer: [Array1DData, Array1DRenderer],
      ChartTracer: [ChartData, ChartRenderer],
      GraphTracer: [GraphData, GraphRenderer],
    }[className];
    const data = new DataClass();
    this.datas[tracerKey] = data;
    const renderer = (
      <RendererClass key={tracerKey} title={title} data={data} wsProps={{ fixed: true }} />
    );
    this.renderers.push(renderer);
    if (this.onChangeRenderers) this.onChangeRenderers(this.renderers);
  }

  applyTrace() {
    if (this.cursor >= this.traces.length) return false;
    const trace = this.traces[this.cursor++];
    const { tracerKey, method, args } = trace;
    try {
      if (method === 'construct') {
        const [className, title] = args;
        this.addTracer(className, tracerKey, title);
        return true;
      } else {
        const data = this.datas[tracerKey];
        const delay = method === 'delay';
        const newArgs = [...args];
        if (delay) {
          const lineNumber = newArgs.shift();
          this.setLineIndicator({ lineNumber, cursor: this.cursor });
        }
        data[method](...newArgs);
        return !delay;
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

  execute() {
    const { name, content } = this.file;
    const ext = extension(name);
    if (ext in CompilerApi) {
      return CompilerApi[ext](content).then(traces => this.reset(traces));
    } else {
      return Promise.reject(new Error('Language Not Supported'));
    }
  }

  runInitial() {
    this.execute()
      .then(() => this.applyTraceChunk())
      .catch(() => {
        this.reset();
        this.render();
      });
  }

  run() {
    this.execute()
      .then(() => {
        this.resume();
        this.setStarted(true);
      })
      .catch(error => {
        this.reset();
        this.render();
        this.handleError(error);
      });
  }

  prev() {
    this.pause();
    const lastChunk = this.chunkCursor - 1;
    this.resetCursor();
    do {
      this.applyTraceChunk(false);
    } while (this.chunkCursor < lastChunk);
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