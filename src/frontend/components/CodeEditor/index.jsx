import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/ext/searchbox';
import { tracerManager } from '/core';
import { classes } from '/common/util';
import styles from './stylesheet.scss';
import { ContributorsViewer } from '/components';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineMarker: null,
      code: '',
    };
  }

  componentDidMount() {
    const { file } = this.props;
    this.handleChangeCode(file.content);

    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));
  }

  componentWillReceiveProps(nextProps) {
    const { file } = nextProps;
    if (file !== this.props.file) {
      this.handleChangeCode(file.content);
    }
  }

  componentWillUnmount() {
    tracerManager.setOnUpdateLineIndicator(null);
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
    this.setState({ code });
    tracerManager.setCode(code);
  }

  render() {
    const { className, file } = this.props;
    const { lineMarker, code } = this.state;

    return (
      <div className={classes(styles.code_editor, className)}>
        <AceEditor
          className={styles.ace_editor}
          mode="javascript"
          theme="tomorrow_night_eighties"
          name="code_editor"
          editorProps={{ $blockScrolling: true }}
          onChange={code => this.handleChangeCode(code)}
          markers={lineMarker ? [lineMarker] : []}
          value={code} />
        <ContributorsViewer contributors={file.contributors} />
      </div> // TODO: need resizing when parent resizes
    );
  }
}

export default CodeEditor;

