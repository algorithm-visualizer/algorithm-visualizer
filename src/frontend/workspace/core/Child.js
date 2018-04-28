import React from 'react';
import uuid from 'uuid';
import { Workspace } from '/workspace/components';

class Child {
  getDefaultProps() {
    return {
      reference: Workspace.createReference(),
      removable: true,
    };
  }

  createElement(wsProps) {
    return (
      <div wsProps={wsProps} />
    );
  }

  constructor(element) {
    if (!React.isValidElement(element)) {
      element = this.createElement(element);
    }
    const { wsProps = {} } = element.props;
    Object.assign(this, this.getDefaultProps(), wsProps);
    this.reference.core = this;
    this.key = uuid.v4();
    this.parent = null;
    this.init(element);
  }

  init(element) {
    this.element = React.cloneElement(element, { core: this });
  }

  setParent(parent) {
    if (this.parent) this.remove(true);
    this.parent = parent;
  }

  setElement(element) {
    this.init(element);
    this.parent.render();
  }

  remove(moving = false) {
    if (this.removable || moving) {
      const index = this.parent.findIndex(this.key);
      this.parent.removeChild(index);
    }
  }
}

export default Child;