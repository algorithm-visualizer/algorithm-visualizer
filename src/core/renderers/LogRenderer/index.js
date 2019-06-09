import React from 'react';
import { Renderer } from 'core/renderers';
import styles from './LogRenderer.module.scss';

class LogRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot);
    const div = this.elementRef.current;
    div.scrollTop = div.scrollHeight;
  }

  renderData() {
    const { log } = this.props.data;

    return (
      <div className={styles.log} ref={this.elementRef}>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: log }} />
      </div>
    );
  }
}

export default LogRenderer;

