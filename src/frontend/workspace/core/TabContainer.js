import React from 'react';
import { Section, Tab } from '/workspace/core';
import { WSTabContainer } from '/workspace/components';
import { parentMixin } from '/workspace/core/mixins';

class TabContainer extends parentMixin(Section) {
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
    this.tabIndex = index;
    super.addChild(child, index);
  }

  removeChild(index) {
    this.tabIndex = Math.min(this.tabIndex, this.children.length - 2);
    super.removeChild(index);
  }

  setTabIndex(tabIndex) {
    this.tabIndex = tabIndex;
    this.render();
  }
}

export default TabContainer;