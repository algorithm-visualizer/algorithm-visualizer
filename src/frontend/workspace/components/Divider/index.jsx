import React from 'react';
import { DropTarget } from 'react-dnd';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

const dividerTarget = {
  canDrop(props, monitor) {
    return !props.disableDrop;
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const { section, tab } = item;
    if (section) props.onDropSection(section);
    else if (tab) props.onDropTab(tab);
  }
};

@DropTarget(['section', 'tab'], dividerTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
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
    const { className, horizontal, connectDropTarget, isOver, canDrop } = this.props;

    return connectDropTarget(
      <div
        className={classes(styles.divider, horizontal ? styles.horizontal : styles.vertical, isOver && canDrop && styles.dropping, className)}
        onMouseDown={this.handleMouseDown} />
    );
  }
}

export default Divider;

