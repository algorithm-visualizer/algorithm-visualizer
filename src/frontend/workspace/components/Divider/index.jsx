import React from 'react';
import { classes } from '/common/util';
import { Droppable } from '/workspace/components';
import styles from './stylesheet.scss';

class Divider extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    this.target = e.target;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { onResize } = this.props;
    if (onResize) onResize(this.target.parentElement, e.clientX, e.clientY);
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { className, horizontal, onResize, ...props } = this.props;

    return (
      <Droppable
        className={classes(styles.divider, horizontal ? styles.horizontal : styles.vertical, className)}
        droppingClassName={styles.dropping}
        onMouseDown={this.handleMouseDown}
        {...props} />
    );
  }
}

export default Divider;

