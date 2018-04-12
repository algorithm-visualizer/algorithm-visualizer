import React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import { calculatePercentageHeight, classes } from '/common/util';
import { Divider, Ellipsis, TabBar } from '/components';
import { actions as envActions } from '/reducers/env';
import { actions as tracerActions } from '/reducers/tracer';
import { tracerManager } from '/core';
import { AlgorithmApi } from '/apis';
import styles from './stylesheet.scss';

@connect(
  ({ env, tracer }) => ({
    env,
    tracer,
  }), {
    ...envActions,
    ...tracerActions,
  }
)
class EditorSection extends React.Component {
  constructor(props) {
    super(props);

    const { lineIndicator } = tracerManager;
    this.state = {
      dataContainerHeight: '30%',
      lineMarker: this.createLineMarker(lineIndicator),
    };
  }

  componentDidMount() {
    const { categoryKey, algorithmKey, fileKey } = this.props.env;
    this.loadCodeAndData(categoryKey, algorithmKey, fileKey);
    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));
  }

  componentWillUnmount() {
    tracerManager.setOnUpdateLineIndicator(null);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey, fileKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey ||
      fileKey !== this.props.env.fileKey) {
      this.loadCodeAndData(categoryKey, algorithmKey, fileKey);
    }
  }

  createLineMarker(lineIndicator) {
    if (lineIndicator === null) return null;
    const { lineNumber, cursor } = lineIndicator;
    return {
      startRow: lineNumber,
      startCol: 0,
      endRow: lineNumber,
      endCol: Infinity,
      className: styles.current_line_marker,
      type: 'line',
      inFront: true,
      _key: cursor,
    };
  }

  loadCodeAndData(categoryKey, algorithmKey, fileKey) {
    if (!fileKey) return;
    AlgorithmApi.getDataFile(categoryKey, algorithmKey, fileKey)
      .then(data => this.handleChangeData(data))
      .then(() => AlgorithmApi.getCodeFile(categoryKey, algorithmKey, fileKey))
      .then(code => this.handleChangeCode(code));
  }

  handleResizeDataContainer(x, y) {
    const dataContainerHeight = calculatePercentageHeight(this.elContent, y);
    this.setState({ dataContainerHeight });
  }

  handleChangeData(data) {
    this.props.setData(data);
    this.executeData(data);
  }

  handleChangeCode(code) {
    this.props.setCode(code);
    const { data } = this.props.tracer;
    this.executeData(data);
  }

  executeData(data) {
    tracerManager.runData(data);
  }

  render() {
    const { dataContainerHeight, lineMarker } = this.state;
    const { className } = this.props;
    const { categoryKey, algorithmKey, fileKey, algorithm } = this.props.env;
    const { data, code } = this.props.tracer;

    const fileKeys = Object.keys(algorithm.files);
    const tabIndex = fileKeys.findIndex(v => v === fileKey);
    const fileInfo = algorithm.files[fileKey];

    return (
      <section className={classes(styles.editor_section, className)}>
        <TabBar titles={fileKeys} selectedIndex={tabIndex}
                onClickTab={tabIndex => this.props.selectFile(categoryKey, algorithmKey, fileKeys[tabIndex])} />
        <div className={styles.info_container}>
          <FontAwesomeIcon fixedWidth icon={faInfoCircle} className={styles.info_icon} />
          <Ellipsis className={styles.info_text}>{fileInfo}</Ellipsis>
        </div>
        <div className={styles.content} ref={ref => this.elContent = ref}>
          <div className={styles.data_container} style={{ height: dataContainerHeight }}>
            <AceEditor
              className={styles.editor}
              mode="javascript"
              theme="tomorrow_night_eighties"
              name="data_editor"
              editorProps={{ $blockScrolling: true }}
              onChange={value => this.handleChangeData(value)}
              value={data} />
          </div>
          <Divider horizontal onResize={(x, y) => this.handleResizeDataContainer(x, y)} />
          <div className={styles.code_container}>
            <AceEditor
              className={styles.editor}
              mode="javascript"
              theme="tomorrow_night_eighties"
              name="code_editor"
              editorProps={{ $blockScrolling: true }}
              onChange={value => this.handleChangeCode(value)}
              markers={lineMarker ? [lineMarker] : []}
              value={code} />
          </div>
        </div>
      </section>
    );
  }
}

export default EditorSection;

