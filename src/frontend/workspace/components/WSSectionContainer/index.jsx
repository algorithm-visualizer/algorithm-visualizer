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
    this.handleDropSectionToContainer(tabContainer, index);
    tabContainer.addChild(tab);
  }

  handleDropSectionToContainer(section, index) {
    this.core.addChild(section, index);
  }

  handleDropTabToSection(tab, index, before = false) {
    const tabContainer = new TabContainer();
    this.handleDropSectionToSection(tabContainer, index, before);
    tabContainer.addChild(tab);
  }

  handleDropSectionToSection(section, index, before = false) {
    const child = this.core.children[index];
    const sectionContainer = new SectionContainer({ horizontal: !this.core.horizontal });
    this.core.addChild(sectionContainer, index);
    sectionContainer.addChild(child);
    sectionContainer.addChild(section, before ? 0 : 1);
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
                   onDropTab={tab => this.handleDropTabToContainer(tab, i)}
                   onDropSection={section => this.handleDropSectionToContainer(section, i)} />
        );
      }
      elements.push(
        <div key={child.key} className={classes(styles.wrapper, !horizontal && styles.horizontal)}
             style={style}>
          <Divider horizontal={!horizontal}
                   onDropTab={tab => this.handleDropTabToSection(tab, i, true)}
                   onDropSection={section => this.handleDropSectionToSection(section, i, true)} />
          {child.element}
          <Divider horizontal={!horizontal}
                   onDropTab={tab => this.handleDropTabToSection(tab, i)}
                   onDropSection={section => this.handleDropSectionToSection(section, i)} />
        </div>
      );
    });
    if (elements.length) {
      const firstIndex = children.indexOf(visibleChildren[0]);
      const lastIndex = children.indexOf(visibleChildren[visibleChildren.length - 1]);
      elements.unshift(
        <Divider key="divider-first" horizontal={horizontal}
                 onDropTab={tab => this.handleDropTabToContainer(tab, firstIndex)}
                 onDropSection={section => this.handleDropSectionToContainer(section, firstIndex)} />
      );
      elements.push(
        <Divider key="divider-last" horizontal={horizontal}
                 onDropTab={tab => this.handleDropTabToContainer(tab, lastIndex + 1)}
                 onDropSection={section => this.handleDropSectionToContainer(section, lastIndex + 1)} />
      );
    } else {
      elements.push(
        <Droppable key="empty" className={styles.wrapper} droppingClassName={styles.dropping}
                   onDropTab={tab => this.handleDropTabToContainer(tab)}
                   onDropSection={section => this.handleDropSectionToContainer(section)} />
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
