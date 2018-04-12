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
    const { lastChild } = this.element.current;
    if (lastChild) lastChild.scrollIntoView();
  }

  renderData() {
    const { messages } = this.props.data;

    return (
      <div className={styles.log} ref={this.element}>
        {
          messages.map((message, i) => (
            <span className={styles.message} key={i} dangerouslySetInnerHTML={{ __html: message }} />
          ))
        }
      </div>
    );
  }
}

export default LogRenderer;

