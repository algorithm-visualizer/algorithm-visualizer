import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/plain_text';
import 'brace/mode/markdown';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/ext/searchbox';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import { tracerManager } from '/core';
import { classes, extension } from '/common/util';
import { actions } from '/reducers';
import { connect } from 'react-redux';
import { languages } from '/common/config';
import { Button, Ellipsis } from '/components';
import styles from './stylesheet.scss';

@connect(({ current, env }) => ({ current, env }), actions)
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineMarker: null,
    };
  }

  componentDidMount() {
    const { file } = this.props;
    tracerManager.setFile(file, true);

    tracerManager.setOnUpdateLineIndicator(lineIndicator => this.setState({ lineMarker: this.createLineMarker(lineIndicator) }));
  }

  componentWillReceiveProps(nextProps) {
    const { file } = nextProps;
    if (file !== this.props.file) {
      tracerManager.setFile(file, extension(file.name) === 'js');
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
    const { file } = this.props;
    this.props.modifyFile({ ...file, content: code });
  }

  render() {
    const { className, file, onDeleteFile } = this.props;
    const { user } = this.props.env;
    const { lineMarker } = this.state;

    const fileExt = extension(file.name);
    const language = languages.find(language => language.ext === fileExt);
    const mode = language ? language.mode : fileExt === 'md' ? 'markdown' : 'plain_text';

    return (
      <div className={classes(styles.code_editor, className)}>
        <AceEditor
          className={styles.ace_editor}
          mode={mode}
          theme="tomorrow_night_eighties"
          name="code_editor"
          editorProps={{ $blockScrolling: true }}
          onChange={code => this.handleChangeCode(code)}
          markers={lineMarker ? [lineMarker] : []}
          value={file.content} />
        <div className={classes(styles.contributors_viewer, className)}>
          <span className={classes(styles.contributor, styles.label)}>Contributed by</span>
          {
            (file.contributors.length ? file.contributors : user ? [user] : []).map(contributor => (
              <Button className={styles.contributor} icon={contributor.avatar_url} key={contributor.login}
                      href={`https://github.com/${contributor.login}`}>
                {contributor.login}
              </Button>
            ))
          }
          <div className={styles.empty}>
            <div className={styles.empty} />
            <Button className={styles.delete} icon={faTrashAlt} primary onClick={() => onDeleteFile(file)}>
              <Ellipsis>Delete File</Ellipsis>
            </Button>
          </div>
        </div>
      </div> // TODO: need resizing when parent resizes
    );
  }
}

export default CodeEditor;
