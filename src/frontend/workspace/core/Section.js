import { Child } from '/workspace/core';

class Section extends Child {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
      weight: 1,
      visible: true,
    };
  }

  setVisible(visible) {
    this.visible = visible;
    this.parent.render();
  }
}

export default Section;