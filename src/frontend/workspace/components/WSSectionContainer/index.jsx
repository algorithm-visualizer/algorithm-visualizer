import React from 'react';
import { classes } from '/common/util';
import { Divider, Droppable } from '/workspace/components';
import { SectionContainer, TabContainer } from '/workspace/core';
import styles from './stylesheet.scss';

class WSSectionContainer extends React.Component {
  constructor(props) {
    super(props);

    const { core } = props;
    core.reference.component = this;
    this.core = core;
  }

  handleResize(index, targetElement, clientX, clientY) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = targetElement.parentElement;
    const { horizontal } = this.core;
    const position = horizontal ? clientX - offsetLeft : clientY - offsetTop;
    const size = horizontal ? offsetWidth : offsetHeight;
    this.core.resizeChild(index, position, size);
  }

  handleDropTabToContainer(tab, index) {
    const tabContainer = new TabContainer();
    this.core.addChild(tabContainer, index);
    tabContainer.addChild(tab);
  }

  handleDropTabToSection(tab, index, before = false) {
    const child = this.core.children[index];
    const tabContainer = new TabContainer();
    const sectionContainer = new SectionContainer({ horizontal: !this.core.horizontal });
    this.core.addChild(sectionContainer, index);
    sectionContainer.addChild(child);
    sectionContainer.addChild(tabContainer, before ? 0 : 1);
    tabContainer.addChild(tab);
  }

  render() {
    const { className } = this.props;
    const { children, horizontal } = this.core;

    const visibleChildren = children.filter(child => child.visible);
    const weights = visibleChildren.map(section => section.weight);
    const totalWeight = weights.reduce((sumWeight, weight) => sumWeight + weight, 0);
    const elements = [];
    children.forEach((child, i) => {
      if (!child.visible) return;
      const visibleIndex = visibleChildren.findIndex(visibleChild => visibleChild === child);
      const portion = child.weight / totalWeight;
      const style = { flex: portion };
      if (elements.length) {
        elements.push(
          <Divider key={`divider-${i}`} horizontal={horizontal}
                   onResize={(target, x, y) => this.handleResize(visibleIndex - 1, target, x, y)}
                   onDropTab={tab => this.handleDropTabToContainer(tab, i)} />
        );
      }
      if (child instanceof SectionContainer || visibleChildren.length === 1) {
        elements.push(
          <div key={child.key} className={styles.wrapper} style={style}>
            {child.element}
          </div>
        );
      } else {
        elements.push(
          <div key={child.key} className={classes(styles.wrapper, !horizontal && styles.horizontal)}
               style={style}>
            <Divider horizontal={!horizontal} onDrop={data => this.handleDropToSection(data, i, true)} />
            {child.element}
            <Divider horizontal={!horizontal} onDrop={data => this.handleDropToSection(data, i)} />
          </div>
        );
      }
    });
    if (elements.length) {
      const firstIndex = children.indexOf(visibleChildren[0]);
      const lastIndex = children.indexOf(visibleChildren[visibleChildren.length - 1]);
      elements.unshift(
        <Divider key="divider-first" horizontal={horizontal}
                 onDropTab={tab => this.handleDropTabToContainer(tab, firstIndex)} />
      );
      elements.push(
        <Divider key="divider-last" horizontal={horizontal}
                 onDropTab={tab => this.handleDropTabToContainer(tab, lastIndex + 1)} />
      );
    } else {
      elements.push(
        <Droppable key="empty" className={styles.wrapper} droppingClassName={styles.dropping}
                   onDropTab={tab => this.handleDropTabToContainer(tab)} />
      );
    }

    return (
      <div className={classes(styles.container, horizontal && styles.horizontal, className)}>
        {elements}
      </div>
    );
  }
}

export default WSSectionContainer;
