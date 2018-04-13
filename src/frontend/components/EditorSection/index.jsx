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
import { tracerManager } from '/core';
import { DirectoryApi } from '/apis';
import styles from './stylesheet.scss';

@connect(
  ({ env }) => ({
    env,
  }), {
    ...envActions,
  }
)
class EditorSection extends React.Component {
  constructor(props) {
    super(props);

    const { lineIndicator } = tracerManager;
    this.state = {
      dataContainerHeight: '30%',
      lineMarker: this.createLineMarker(lineIndicator),
      data: '',
      code: '',
    };
  }

  componentDidMount() {
    tracerManager.setDataGetter(() => this.state.data);
    tracerManager.setCodeGetter(() => this.state.code);
    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));

    const { categoryKey, algorithmKey, fileKey } = this.props.env;
    this.loadCodeAndData(categoryKey, algorithmKey, fileKey);
  }

  componentWillUnmount() {
    tracerManager.setDataGetter(null);
    tracerManager.setCodeGetter(null);
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
    DirectoryApi.getFile(categoryKey, algorithmKey, fileKey)
      .then(({ data, code }) => {
        this.setState({ data, code }, () => tracerManager.runData());
      });
  }

  handleResizeDataContainer(x, y) {
    const dataContainerHeight = calculatePercentageHeight(this.elContent, y);
    this.setState({ dataContainerHeight });
  }

  handleChangeData(data) {
    this.setState({ data }, () => tracerManager.runData());
  }

  handleChangeCode(code) {
    this.setState({ code }, () => tracerManager.runData());
  }

  render() {
    const { dataContainerHeight, lineMarker, data, code } = this.state;
    const { className } = this.props;
    const { categories, categoryKey, algorithmKey, fileKey } = this.props.env;

    const category = categories.find(category => category.key === categoryKey);
    const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
    const tabs = algorithm.files.map(file => ({
      title: file.name,
      props: {
        to: `/${category.key}/${algorithm.key}/${file.key}`
      },
    }));
    const tabIndex = algorithm.files.findIndex(file => file.key === fileKey);
    const fileInfo = ''; // TODO

    return (
      <section className={classes(styles.editor_section, className)}>
        <TabBar tabs={tabs} tabIndex={tabIndex} />
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

