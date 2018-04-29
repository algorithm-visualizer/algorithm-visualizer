import React from 'react';
import styles from './stylesheet.scss';
import { Ellipsis } from '/components';
import { classes } from '/common/util';

class Renderer extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.lastX = null;
    this.lastY = null;
    this.centerX = 0;
    this.centerY = 0;
    this.zoom = 1;
    this.zoomFactor = 1.01;
    this.zoomMax = 20;
    this.zoomMin = 1 / 20;
  }

  componentDidMount() {
    const { data } = this.props;
    this.mountData(data);
  }

  componentWillUnmount() {
    const { data } = this.props;
    this.unmountData(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.unmountData(this.props.data);
      this.mountData(data);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  mountData(data) {
    data.setOnRender(() => this.refresh());
  }

  unmountData(data) {
    data.setOnRender(null);
  }

  handleMouseDown(e) {
    const { clientX, clientY } = e;
    this.lastX = clientX;
    this.lastY = clientY;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { clientX, clientY } = e;
    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;
    this.centerX -= dx;
    this.centerY -= dy;
    this.refresh();
    this.lastX = clientX;
    this.lastY = clientY;
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleWheel(e) {
    const { deltaY } = e;
    this.zoom *= Math.pow(this.zoomFactor, deltaY);
    this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, this.zoom));
    this.refresh();
  }

  toString(value) {
    switch (typeof(value)) {
      case 'number':
        return value === Infinity ? '∞' : Number.isInteger(value) ? value.toString() : value.toFixed(3);
      case 'boolean':
        return value ? 'T' : 'F';
      default:
        return value;
    }
  }

  refresh() {
    this.forceUpdate();
  }

  renderData() {
    return null;
  }

  render() {
    const { className, title } = this.props;

    return (
      <div className={classes(styles.renderer, className)} onMouseDown={this.handleMouseDown}
           onWheel={this.handleWheel}>
        <Ellipsis className={styles.title}>{title}</Ellipsis>
        {
          this.renderData()
        }
      </div>
    );
  }
}

export default Renderer;

