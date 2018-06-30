import React from 'react';

class Section {
  getDefaultProps() {
    return {
      id: null,
      removable: true,
      visible: true,
      resizable: true,
      weight: 1,
      minWeight: 0,
      maxWeight: Number.MAX_VALUE,
      size: -1,
      minSize: 0,
      maxSize: Number.MAX_VALUE,
      fixed: false,
    };
  }

  constructor(element) {
    if (!React.isValidElement(element)) {
      element = this.createElement(element);
    }
    this.parent = null;
    Object.assign(this, this.getDefaultProps());
    this.setElement(element);
  }

  createElement(wsProps) {
    return (
      <div wsProps={wsProps} />
    );
  }

  setElement(element) {
    const { wsProps = {} } = element.props;
    Object.assign(this, wsProps);
    this.relative = this.size === -1;
    this.element = element;
  }

  setParent(parent) {
    if (this.parent) this.remove(true);
    this.parent = parent;
  }

  remove(moving = false) {
    if (this.removable || moving) {
      const index = this.parent.findIndex(this);
      this.parent.removeChild(index);
    }
  }
}

export default Section;