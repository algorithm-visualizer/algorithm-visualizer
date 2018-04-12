import React from 'react';
import { classes } from '/common/util';
import { tracerManager } from '/core';
import styles from './stylesheet.scss';

class RendererContainer extends React.Component {
  constructor(props) {
    super(props);

    const { renderers } = tracerManager;
    this.state = {
      renderers,
    };
  }

  componentDidMount() {
    tracerManager.setOnRender(renderers => this.setState({ renderers }));
  }

  componentWillMount() {
    tracerManager.setOnRender(null);
  }

  render() {
    const { className } = this.props;
    const { renderers } = this.state;

    return (
      <div className={classes(styles.renderer_container, className)}>
        {renderers}
      </div>
    );
  }
}

export default RendererContainer;

