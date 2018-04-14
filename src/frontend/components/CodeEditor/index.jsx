import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import { tracerManager } from '/core';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    const { lineIndicator, code } = tracerManager;
    this.state = {
      lineMarker: this.createLineMarker(lineIndicator),
      code,
    };
  }

  componentDidMount() {
    tracerManager.setOnUpdateCode(code => this.setState({ code }));
    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));
  }

  componentWillUnmount() {
    tracerManager.setOnUpdateCode(null);
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

  render() {
    const { lineMarker, code } = this.state;
    const { className, relativeWeight } = this.props;

    return (
      <AceEditor
        className={classes(styles.code_editor, className)}
        mode="javascript"
        theme="tomorrow_night_eighties"
        name="code_editor"
        editorProps={{ $blockScrolling: true }}
        onChange={code => tracerManager.setCode(code)}
        markers={lineMarker ? [lineMarker] : []}
        value={code}
        width={`${relativeWeight}`} /> // trick to update on resize
    );
  }
}

export default CodeEditor;

