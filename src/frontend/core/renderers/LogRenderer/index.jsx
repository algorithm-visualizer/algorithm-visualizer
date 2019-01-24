import React from 'react';
import { Renderer } from '/core/renderers';
import styles from './stylesheet.scss';

class LogRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.element = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot);
    const div = this.element.current;
    div.scrollTop = div.scrollHeight;
  }

  renderData() {
    const { log } = this.props.data;

    return (
      <div className={styles.log} ref={this.element} dangerouslySetInnerHTML={{ __html: log }} />
    );
  }
}

export default LogRenderer;

