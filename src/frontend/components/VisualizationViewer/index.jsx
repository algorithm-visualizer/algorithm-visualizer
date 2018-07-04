import React from 'react';
import { classes } from '/common/util';
import { ResizableContainer } from '/components';
import styles from './stylesheet.scss';
import { tracerManager } from '../../core';

class VisualizationViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderers: [],
      renderersWeights: [],
    };
  }

  componentDidMount() {
    tracerManager.setOnChangeRenderers(renderers => {
      const renderersWeights = renderers.map(() => 1);
      this.setState({ renderers, renderersWeights });
    });
  }

  componentWillUnmount() {
    tracerManager.setOnChangeRenderers(null);
  }

  handleChangeRenderersWeights(renderersWeights) {
    this.setState({ renderersWeights });
  }

  render() {
    const { className } = this.props;
    const { renderers, renderersWeights } = this.state;

    return (
      <ResizableContainer className={classes(styles.visualization_viewer, className)} weights={renderersWeights}
                          visibles={renderers.map(() => true)}
                          onChangeWeights={weights => this.handleChangeRenderersWeights(weights)}>
        {renderers}
      </ResizableContainer>
    );
  }
}

export default VisualizationViewer;
