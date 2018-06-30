import React from 'react';
import { Section } from '/workspace/core';

class Parent extends Section {
  constructor(element) {
    super(element);
    this.children = [];
  }

  setElement(element) {
    super.setElement(React.cloneElement(element, { core: this }));
  }

  childify(element) {
    return new Section(element);
  }

  addChild(child, index = this.children.length) {
    if (child.parent === this) {
      const oldIndex = this.children.indexOf(child);
      this.children[oldIndex] = null;
      this.children.splice(index, 0, child);
      this.children = this.children.filter(child => child);
    } else {
      this.children.splice(index, 0, child);
      child.setParent(this);
    }
  }

  removeChild(index) {
    this.children.splice(index, 1);
    if (this.children.length === 0) this.remove();
  }

  findIndex(child) {
    return this.children.indexOf(child);
  }

  render() {
    if (this.component) this.component.forceUpdate();
  }
}

export default Parent;