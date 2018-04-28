import { Child } from '/workspace/core';

class Section extends Child {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
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
    super(element);
    this.relative = this.size === -1;
  }

  setVisible(visible) {
    this.visible = visible;
    this.parent.render();
  }
}

export default Section;