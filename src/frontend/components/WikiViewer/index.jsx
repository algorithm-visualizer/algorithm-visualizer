import React from 'react';
import { DocApi } from '/apis';
import { MarkdownViewer } from '/components';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class WikiViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
    };
  }

  componentDidMount() {
    this.loadMarkdown('Tracer');
  }

  loadMarkdown(href) {
    DocApi.getDoc(href)
      .then(source => this.setState({ source }));
  }

  render() {
    const { className, source } = this.state;

    return (
      <MarkdownViewer className={classes(styles.wiki_viewer, className)} source={source}
                      onClickLink={href => this.loadMarkdown(href)} />
    );
  }
}

export default WikiViewer;
