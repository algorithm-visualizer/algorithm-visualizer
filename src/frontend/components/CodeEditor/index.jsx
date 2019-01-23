import React from 'react';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import { classes, extension } from '/common/util';
import { actions } from '/reducers';
import { connect } from 'react-redux';
import { languages } from '/common/config';
import { Button, Ellipsis, FoldableAceEditor } from '/components';
import styles from './stylesheet.scss';

@connect(({ env, player }) => ({ env, player }), actions, null, { withRef: true })
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.aceEditorRef = React.createRef();
  }

  handleChangeCode(code) {
    const { file } = this.props;
    this.props.modifyFile({ ...file, content: code });
    if (extension(file.name) === 'md') this.props.shouldBuild();
  }

  handleResize() {
    this.aceEditorRef.current.editor.resize();
  }

  render() {
    const { className, file, onClickDelete } = this.props;
    const { user } = this.props.env;
    const { lineIndicator, buildAt } = this.props.player;

    if (!file) return null;

    const fileExt = extension(file.name);
    const language = languages.find(language => language.ext === fileExt);
    const mode = language ? language.mode :
      fileExt === 'md' ? 'markdown' :
        fileExt === 'json' ? 'json' :
          'plain_text';

    return (
      <div className={classes(styles.code_editor, className)}>
        <FoldableAceEditor
          className={styles.ace_editor}
          ref={this.aceEditorRef}
          mode={mode}
          theme="tomorrow_night_eighties"
          name="code_editor"
          editorProps={{ $blockScrolling: true }}
          onChange={code => this.handleChangeCode(code)}
          markers={lineIndicator ? [{
            startRow: lineIndicator.lineNumber,
            startCol: 0,
            endRow: lineIndicator.lineNumber,
            endCol: Infinity,
            className: styles.current_line_marker,
            type: 'line',
            inFront: true,
            _key: lineIndicator.cursor,
          }] : []}
          foldAt={buildAt}
          value={file.content} />
        <div className={classes(styles.contributors_viewer, className)}>
          <span className={classes(styles.contributor, styles.label)}>Contributed by</span>
          {
            (file.contributors || [user || { login: 'guest', avatar_url: faUser }]).map(contributor => (
              <Button className={styles.contributor} icon={contributor.avatar_url} key={contributor.login}
                      href={`https://github.com/${contributor.login}`}>
                {contributor.login}
              </Button>
            ))
          }
          <div className={styles.empty}>
            <div className={styles.empty} />
            <Button className={styles.delete} icon={faTrashAlt} primary onClick={onClickDelete}
                    confirmNeeded>
              <Ellipsis>Delete File</Ellipsis>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CodeEditor;
