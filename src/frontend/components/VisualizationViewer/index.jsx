import React from 'react';
import { connect } from 'react-redux';
import { classes } from '/common/util';
import { ResizableContainer } from '/components';
import { actions } from '/reducers';
import styles from './stylesheet.scss';
import { Array1DData, Array2DData, ChartData, Data, GraphData, LogData, MarkdownData } from '/core/datas';

@connect(({ player }) => ({ player }), actions)
class VisualizationViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataWeights: {},
    };

    this.datas = [];
  }

  componentDidMount() {
    const { chunks, cursor } = this.props.player;
    this.update(chunks, cursor);
  }

  componentWillReceiveProps(nextProps) {
    const { chunks, cursor } = nextProps.player;
    const { chunks: oldChunks, cursor: oldCursor } = this.props.player;
    if (chunks !== oldChunks || cursor !== oldCursor) {
      this.update(chunks, cursor, oldChunks, oldCursor);
    }
  }

  update(chunks, cursor, oldChunks = [], oldCursor = 0) {
    let applyingChunks;
    if (cursor > oldCursor) {
      applyingChunks = chunks.slice(oldCursor, cursor);
    } else {
      this.datas = [];
      applyingChunks = chunks.slice(0, cursor);
    }
    applyingChunks.forEach(chunk => this.applyChunk(chunk));

    const dataWeights = chunks === oldChunks ? { ...this.state.dataWeights } : {};
    this.datas.forEach(data => {
      if (!(data.tracerKey in dataWeights)) {
        dataWeights[data.tracerKey] = 1;
      }
    });
    this.setState({ dataWeights });

    const lastChunk = applyingChunks[applyingChunks.length - 1];
    if (lastChunk && lastChunk.lineNumber !== undefined) {
      this.props.setLineIndicator({ lineNumber: lastChunk.lineNumber, cursor });
    } else {
      this.props.setLineIndicator(undefined);
    }
  }

  addTracer(className, tracerKey, title) {
    const DataClass = {
      Tracer: Data,
      MarkdownTracer: MarkdownData,
      LogTracer: LogData,
      Array2DTracer: Array2DData,
      Array1DTracer: Array1DData,
      ChartTracer: ChartData,
      GraphTracer: GraphData,
    }[className];
    const data = new DataClass(tracerKey, title, this.datas);
    this.datas.push(data);
  }

  applyTrace(trace) {
    const { tracerKey, method, args } = trace;
    try {
      if (method === 'construct') {
        const [className, title] = args;
        this.addTracer(className, tracerKey, title);
      } else {
        const data = this.datas.find(data => data.tracerKey === tracerKey);
        data[method](...args);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(error);
    this.props.showErrorToast({ name: error.name, message: error.message });
  }

  applyChunk(chunk) {
    chunk.traces.forEach(trace => this.applyTrace(trace));
  }

  handleChangeWeights(weights) {
    const dataWeights = {};
    weights.forEach((weight, i) => {
      dataWeights[this.datas[i].tracerKey] = weight;
    });
    this.setState({ dataWeights });
  }

  render() {
    const { className } = this.props;
    const { dataWeights } = this.state;

    return (
      <ResizableContainer className={classes(styles.visualization_viewer, className)}
                          weights={this.datas.map(data => dataWeights[data.tracerKey])}
                          visibles={this.datas.map(() => true)}
                          onChangeWeights={weights => this.handleChangeWeights(weights)}>
        {
          this.datas.map(data => data.render())
        }
      </ResizableContainer>
    );
  }
}

export default VisualizationViewer;
