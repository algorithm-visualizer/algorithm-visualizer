import React from 'react';
import { Renderer } from 'core/renderers';

class Tracer {
  constructor(key, getObject, title) {
    this.key = key;
    this.getObject = getObject;
    this.title = title;
    this.init();
    this.reset();
  }

  getRendererClass() {
    return Renderer;
  }

  init() {
  }

  render() {
    const RendererClass = this.getRendererClass();
    return (
      <RendererClass key={this.key} title={this.title} data={this} />
    );
  }

  set() {
  }

  reset() {
    this.set();
  }
}

export default Tracer;
