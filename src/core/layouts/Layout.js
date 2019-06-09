import React from 'react';
import { ResizableContainer } from 'components';
import { HorizontalLayout } from 'core/layouts';

class Layout {
  constructor(key, getObject, children) {
    this.key = key;
    this.getObject = getObject;
    this.children = children.map(key => this.getObject(key));
    this.weights = children.map(() => 1);
    this.ref = React.createRef();

    this.handleChangeWeights = this.handleChangeWeights.bind(this);
  }

  add(key, index = this.children.length) {
    const child = this.getObject(key);
    this.children.splice(index, 0, child);
    this.weights.splice(index, 0, 1);
  }

  remove(key) {
    const child = this.getObject(key);
    const index = this.children.indexOf(child);
    if (~index) {
      this.children.splice(index, 1);
      this.weights.splice(index, 1);
    }
  }

  removeAll() {
    this.children = [];
    this.weights = [];
  }

  handleChangeWeights(weights) {
    this.weights.splice(0, this.weights.length, ...weights);
    this.ref.current.forceUpdate();
  }

  render() {
    const horizontal = this instanceof HorizontalLayout;

    return (
      <ResizableContainer key={this.key} ref={this.ref} weights={this.weights} horizontal={horizontal}
                          onChangeWeights={this.handleChangeWeights}>
        {
          this.children.map(tracer => tracer && tracer.render())
        }
      </ResizableContainer>
    );
  }
}

export default Layout;
