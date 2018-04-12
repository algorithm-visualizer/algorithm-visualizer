import React from 'react';
import styles from './stylesheet.scss';
import { classes } from '/common/util';

class Divider extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { onResize } = this.props;
    onResize(e.clientX, e.clientY);
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { className, vertical, horizontal } = this.props;

    return (
      <div
        className={classes(styles.divider, vertical && styles.vertical, horizontal && styles.horizontal, className)}
        onMouseDown={this.handleMouseDown} />
    );
  }
}

export default Divider;

