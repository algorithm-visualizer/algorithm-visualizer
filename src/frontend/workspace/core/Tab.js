import { Child } from '/workspace/core';

class Tab extends Child {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
      title: '',
    }
  }
}

export default Tab;