import React from 'react';
import { classes } from '/common/util';
import { Divider } from '/workspace/components';
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
    const { left, top } = targetElement.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = targetElement.parentElement;
    const { horizontal } = this.core;
    const position = horizontal ? clientX - left : clientY - top;
    const containerSize = horizontal ? offsetWidth : offsetHeight;
    this.core.resizeChild(index, position, containerSize);
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
    const totalWeight = visibleChildren.reduce((sumWeight, child) => sumWeight + (child.relative ? child.weight : 0), 0);
    const elements = [];
    let prevFixed = true;
    visibleChildren.forEach((child, visibleIndex) => {
      const index = children.indexOf(child);
      elements.push(
        <Divider key={`divider-before-${child.key}`} horizontal={horizontal}
                 onResize={visibleIndex > 0 && ((target, dx, dy) => this.handleResize(visibleIndex, target, dx, dy))}
                 onDropTab={tab => this.handleDropTabToContainer(tab, index)}
                 onDropSection={section => this.handleDropSectionToContainer(section, index)}
                 disableDrop={prevFixed && child.fixed} />
      );
      const style = child.relative ? {
        flexGrow: child.weight / totalWeight,
      } : {
        flexGrow: 0,
        flexBasis: child.size,
      };
      if (children.length === 1) {
        elements.push(
          <div key={child.key} className={classes(styles.wrapper)} style={style}>
            {child.element}
          </div>
        );
      } else {
        elements.push(
          <div key={child.key} className={classes(styles.wrapper, !horizontal && styles.horizontal)} style={style}>
            {
              !child.fixed &&
              <Divider horizontal={!horizontal}
                       onDropTab={tab => this.handleDropTabToSection(tab, index, true)}
                       onDropSection={section => this.handleDropSectionToSection(section, index, true)} />
            }
            {child.element}
            {
              !child.fixed &&
              <Divider horizontal={!horizontal}
                       onDropTab={tab => this.handleDropTabToSection(tab, index)}
                       onDropSection={section => this.handleDropSectionToSection(section, index)} />
            }
          </div>
        );
      }
      if (visibleIndex === visibleChildren.length - 1) {
        elements.push(
          <Divider key={`divider-after-${child.key}`} horizontal={horizontal}
                   onDropTab={tab => this.handleDropTabToContainer(tab, index + 1)}
                   onDropSection={section => this.handleDropSectionToContainer(section, index + 1)}
                   disableDrop={child.fixed} />
        );
      }
      prevFixed = child.fixed;
    });

    return (
      <div className={classes(styles.container, horizontal && styles.horizontal, className)}>
        {
          elements
        }
      </div>
    );
  }
}

export default WSSectionContainer;
