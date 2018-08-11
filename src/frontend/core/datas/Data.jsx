import React from 'react';
import { Renderer } from '/core/renderers';

class Data {
  constructor(tracerKey, title, datas) {
    this.tracerKey = tracerKey;
    this.title = title;
    this.datas = datas;
    this.init();
    this.reset();
  }

  findData(tracerKey) {
    return this.datas.find(data => data.tracerKey === tracerKey);
  }

  getRendererClass() {
    return Renderer;
  }

  init() {
  }

  render() {
    const RendererClass = this.getRendererClass();
    return (
      <RendererClass key={this.tracerKey} title={this.title} data={this} />
    );
  }

  set() {
  }

  reset() {
    this.set();
  }
}

export default Data;
