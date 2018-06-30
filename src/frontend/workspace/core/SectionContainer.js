import React from 'react';
import { Parent, Section, TabContainer } from '/workspace/core';
import { WSSectionContainer, WSTabContainer } from '/workspace/components';

class SectionContainer extends Parent {
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
      const index = this.parent.findIndex(this);
      this.parent.addChild(child, index);
    }
  }

  resizeChild(index, position, containerSize) {
    const visibleChildren = this.children.filter(child => child.visible);
    let prevChild = visibleChildren.slice(0, index).reverse().find(child => child.resizable);
    let nextChild = visibleChildren.slice(index).find(child => child.resizable);
    if (prevChild && nextChild) {
      let totalSize = 0;
      let totalWeight = 0;
      let subtotalSize = 0;
      let subtotalWeight = 0;
      visibleChildren.forEach((child, i) => {
        if (child.relative) {
          totalWeight += child.weight;
          if (i < index) subtotalWeight += child.weight;
        } else {
          totalSize += child.size;
          if (i < index) subtotalSize += child.size;
        }
      });
      const factor = (containerSize - totalSize) / totalWeight;
      const oldPosition = subtotalSize + subtotalWeight * factor;
      let deltaSize = position - oldPosition;
      if (prevChild.relative) {
        deltaSize = Math.max((prevChild.minWeight - prevChild.weight) * factor, deltaSize);
        deltaSize = Math.min((prevChild.maxWeight - prevChild.weight) * factor, deltaSize);
      } else {
        deltaSize = Math.max(prevChild.minSize - prevChild.size, deltaSize);
        deltaSize = Math.min(prevChild.maxSize - prevChild.size, deltaSize);
      }
      if (nextChild.relative) {
        deltaSize = Math.min((nextChild.weight - nextChild.minWeight) * factor, deltaSize);
        deltaSize = Math.max((nextChild.weight - nextChild.maxWeight) * factor, deltaSize);
      } else {
        deltaSize = Math.min(nextChild.size - nextChild.minSize, deltaSize);
        deltaSize = Math.max(nextChild.size - nextChild.maxSize, deltaSize);
      }
      const deltaWeight = deltaSize / factor;
      if (prevChild.relative) {
        prevChild.weight += deltaWeight;
      } else {
        prevChild.size += deltaSize;
      }
      if (nextChild.relative) {
        nextChild.weight -= deltaWeight;
      } else {
        nextChild.size -= deltaSize;
      }
      this.render();
    }
  }
}

export default SectionContainer;