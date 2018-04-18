import React from 'react';
import { Child } from '/workspace/core';

const parentMixin = (Base = Child) => class Parent extends Base {
  constructor(element) {
    super(element);
    const { children = [] } = this.element.props;
    this.children = [];
    React.Children.forEach(children, element => this.addChild(this.childify(element)));
  }

  childify(element) {
    return new Child(element);
  }

  addChild(child, index = this.children.length) {
    this.children.splice(index, 0, child);
    child.setParent(this);
    this.render();
  }

  removeChild(index) {
    this.children.splice(index, 1);
    if (this.children.length === 0) this.remove();
    this.render();
  }

  findIndex(key) {
    return this.children.findIndex(child => child.key === key);
  }

  render() {
    const { component } = this.reference;
    if (component) component.forceUpdate();
  }
};

export default parentMixin;