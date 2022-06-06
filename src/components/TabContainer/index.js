import React from "react";
import { connect } from "react-redux";
import AutosizeInput from "react-input-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import { classes } from "common/util";
import { actions } from "reducers";
import styles from "./TabContainer.module.scss";
import { CODE_JS } from "files";

class TabContainer extends React.Component {
  handleAddFile() {
    const { files } = this.props.current;
    const newFile = { CODE_JS };
    let count = 0;
    do newFile.name = `code-${++count}.js`;
    while (files.some((file) => file.name === newFile.name));
    this.props.addFile(newFile);
  }

  render() {
    const { className, children } = this.props;
    const { editingFile, files } = this.props.current;

    return (
      <div className={classes(styles.tab_container, className)}>
        <div className={styles.tab_bar}>
          <div className={classes(styles.title, styles.fake)} />
          {files.map((file, i) =>
            file === editingFile ? (
              <div
                className={classes(styles.title, styles.selected)}
                key={i}
                onClick={() => this.props.setEditingFile(file)}
              >
                <AutosizeInput
                  className={styles.input_title}
                  value={file.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => this.props.renameFile(file, e.target.value)}
                />
              </div>
            ) : (
              <div
                className={styles.title}
                key={i}
                onClick={() => this.props.setEditingFile(file)}
              >
                {file.name}
              </div>
            )
          )}
          <div className={styles.title} onClick={() => this.handleAddFile()}>
            <FontAwesomeIcon fixedWidth icon={faPlus} />
          </div>
          <div className={classes(styles.title, styles.fake)} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default connect(
  ({ current, env }) => ({ current, env }),
  actions
)(TabContainer);
