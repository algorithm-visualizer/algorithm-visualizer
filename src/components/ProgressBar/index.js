import React from 'react';
import { classes } from 'common/util';
import styles from './ProgressBar.module.scss';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    this.target = e.target;
    this.handleMouseMove(e);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { left } = this.target.getBoundingClientRect();
    const { offsetWidth } = this.target;
    const { onChangeProgress } = this.props;
    const progress = (e.clientX - left) / offsetWidth;
    if (onChangeProgress) onChangeProgress(progress);
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { className, total, current } = this.props;

    return (
      <div className={classes(styles.progress_bar, className)} onMouseDown={this.handleMouseDown}>
        <div className={styles.active} style={{ width: `${current / total * 100}%` }} />
        <div className={styles.label}>
          <span className={styles.current}>{current}</span> / {total}
        </div>
      </div>
    );
  }
}

export default ProgressBar;
