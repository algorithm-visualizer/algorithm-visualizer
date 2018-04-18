import React from 'react';
import { Section, TabContainer } from '/workspace/core';
import { parentMixin } from '/workspace/core/mixins';
import { WSSectionContainer, WSTabContainer } from '/workspace/components';

class SectionContainer extends parentMixin(Section) {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
      horizontal: true,
    };
  }

  createElement(wsProps) {
    return (
      <WSSectionContainer wsProps={wsProps} />
    );
  }

  childify(element) {
    switch (element.type) {
      case WSSectionContainer:
        return new SectionContainer(element);
      case WSTabContainer:
        return new TabContainer(element);
      default:
        return new Section(element);
    }
  }

  removeChild(index) {
    super.removeChild(index);
    if (this.removable && this.children.length === 1) {
      const [child] = this.children;
      const index = this.parent.findIndex(this.key);
      this.parent.addChild(child, index);
    }
  }

  resizeChild(index, position, size) {
    const visibleChildren = this.children.filter(child => child.visible);
    const weights = visibleChildren.map(child => child.weight);
    const totalWeight = weights.reduce((sumWeight, weight) => sumWeight + weight, 0);

    const startWeight = weights.slice(0, index).reduce((sumWeight, weight) => sumWeight + weight, 0);
    const endWeight = position / size * totalWeight;

    const oldWeight = weights[index];
    const newWeight = endWeight - startWeight;

    const oldScale = totalWeight - startWeight - oldWeight;
    const newScale = totalWeight - startWeight - newWeight;
    const ratio = newScale / oldScale;

    weights[index] = newWeight;
    for (let i = index + 1; i < weights.length; i++) {
      weights[i] *= ratio;
    }

    for (let i = index; i < weights.length; i++) {
      if (weights[i] / totalWeight * size < 20) return;
    }

    for (let i = index; i < weights.length; i++) {
      visibleChildren[i].weight = weights[i];
    }

    this.render();
  }
}

export default SectionContainer;