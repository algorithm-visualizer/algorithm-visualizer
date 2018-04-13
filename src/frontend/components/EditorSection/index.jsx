import React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import { classes } from '/common/util';
import { Ellipsis, TabBar } from '/components';
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
      lineMarker: this.createLineMarker(lineIndicator),
      code: '',
    };
  }

  componentDidMount() {
    tracerManager.setCodeGetter(() => this.state.code);
    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));

    const { categoryKey, algorithmKey } = this.props.env;
    this.loadCode(categoryKey, algorithmKey);
  }

  componentWillUnmount() {
    tracerManager.setCodeGetter(null);
    tracerManager.setOnUpdateLineIndicator(null);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey) {
      this.loadCode(categoryKey, algorithmKey);
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

  loadCode(categoryKey, algorithmKey) {
    DirectoryApi.getFile(categoryKey, algorithmKey, 'code.js')
      .then(code => {
        this.setState({ code }, () => tracerManager.runInitial());
      });
  }

  handleChangeCode(code) {
    this.setState({ code }, () => tracerManager.runInitial());
  }

  render() {
    const { lineMarker, code } = this.state;
    const { className } = this.props;
    const { categories, categoryKey, algorithmKey } = this.props.env;

    const category = categories.find(category => category.key === categoryKey);
    const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
    const tabs = ['code.js'].map(fileName => ({
      title: fileName,
      props: {
        to: `/${category.key}/${algorithm.key}`
      },
    }));
    const tabIndex = 0; // TODO
    const fileInfo = ''; // TODO

    return (
      <section className={classes(styles.editor_section, className)}>
        <TabBar tabs={tabs} tabIndex={tabIndex} />
        <div className={styles.info_container}>
          <FontAwesomeIcon fixedWidth icon={faInfoCircle} className={styles.info_icon} />
          <Ellipsis className={styles.info_text}>{fileInfo}</Ellipsis>
        </div>
        <div className={styles.content}>
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
      </section>
    );
  }
}

export default EditorSection;

