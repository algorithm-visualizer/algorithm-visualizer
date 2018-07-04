import React from 'react';
import { ContributorsViewer, MarkdownViewer } from '/components';
import styles from './stylesheet.scss';
import { classes } from '/common/util';

class DescriptionViewer extends React.Component {
  render() {
    const { className, file } = this.props;

    return (
      <div className={classes(styles.description_viewer, className)}>
        <MarkdownViewer className={styles.markdown_viewer} source={file.content} />
        <ContributorsViewer contributors={file.contributors} />
      </div>
    );
  }
}

export default DescriptionViewer;
