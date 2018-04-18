import React from 'react';
import { draggingData } from '/workspace/core';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class Droppable extends React.Component {
  constructor(props) {
    super(props);

    this.dropping = 0;
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDragEnter(e) {
    if (++this.dropping === 1) this.forceUpdate();
  }

  handleDragLeave(e) {
    if (--this.dropping === 0) this.forceUpdate();
  }

  handleDragEnd(e) {
    if (this.dropping > 0) {
      this.dropping = 0;
      this.forceUpdate();
    }
  }

  handleDrop(e) {
    e.preventDefault();
    this.handleDragEnd(e);
    const data = draggingData.get(e);
    if (data) {
      const { onDropTab, onDropSection } = this.props;
      switch (data.type) {
        case 'tab':
          onDropTab(data.tab);
          break;
        case 'section':
          onDropSection(data.section);
          break;
      }
    }
  }

  render() {
    const { className, children, onDropTab, onDropSection, droppingClassName, ...props } = this.props;

    return (
      <div
        className={classes(styles.droppable, this.dropping > 0 && droppingClassName, className)}
        onDragOver={e => this.handleDragOver(e)}
        onDragEnter={e => this.handleDragEnter(e)}
        onDragLeave={e => this.handleDragLeave(e)}
        onDragEnd={e => this.handleDragEnd(e)}
        onDrop={e => this.handleDrop(e)} {...props}>
        {children}
      </div>
    );
  }
}

export default Droppable;

