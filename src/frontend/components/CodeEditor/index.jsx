import React from 'react';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import { tracerManager } from '/core';
import { classes } from '/common/util';
import styles from './stylesheet.scss';
import { HierarchyApi } from '/apis';
import { ContributorsViewer } from '/components';
import { actions as envActions } from '/reducers/env';

// TODO: code should not be reloaded when reopening tab
@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions
  }
)
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    const { lineIndicator } = tracerManager;
    this.state = {
      lineMarker: this.createLineMarker(lineIndicator),
      file: null,
    };
  }

  componentDidMount() {
    const { categoryKey, algorithmKey } = this.props.env;
    this.loadFile(categoryKey, algorithmKey);

    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey) {
      this.loadFile(categoryKey, algorithmKey);
    }
  }

  componentWillUnmount() {
    tracerManager.setOnUpdateLineIndicator(null);
  }

  loadFile(categoryKey, algorithmKey) {
    HierarchyApi.getFile(categoryKey, algorithmKey, 'code.js')
      .then(({ file }) => {
        this.setState({ file });
        tracerManager.setCode(file.content);
      })
      .catch(() => this.setState({ file: null }));
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

  handleChangeCode(code) {
    const file = { ...this.state.file, content: code };
    this.setState({ file });
    tracerManager.setCode(code);
  }

  render() {
    const { lineMarker, file } = this.state;
    const { className, relativeWeight } = this.props;

    return file && (
      <div className={classes(styles.code_editor, className)}>
        <AceEditor
          className={styles.ace_editor}
          mode="javascript"
          theme="tomorrow_night_eighties"
          name="code_editor"
          editorProps={{ $blockScrolling: true }}
          onChange={code => this.handleChangeCode(code)}
          markers={lineMarker ? [lineMarker] : []}
          value={file.content}
          width={`${relativeWeight}`} />
        <ContributorsViewer contributors={file.contributors} />
      </div> // TODO: trick to update on resize
    );
  }
}

export default CodeEditor;

