import React from 'react';
import { Parent, Tab } from '/workspace/core';
import { WSTabContainer } from '/workspace/components';

class TabContainer extends Parent {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
      tabIndex: -1,
    };
  }

  createElement(wsProps) {
    return (
      <WSTabContainer wsProps={wsProps} />
    );
  }

  childify(element) {
    return new Tab(element);
  }

  addChild(child, index = this.children.length) {
    super.addChild(child, index);
    this.setTabIndex(Math.min(index, this.children.length - 1));
  }

  removeChild(index) {
    super.removeChild(index);
    this.setTabIndex(Math.min(this.tabIndex, this.children.length - 1));
  }

  setTabIndex(tabIndex) {
    this.tabIndex = tabIndex;
    this.render();
  }
}

export default TabContainer;