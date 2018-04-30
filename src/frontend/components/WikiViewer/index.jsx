import React from 'react';
import { WikiApi } from '/apis';
import { MarkdownViewer } from '/components';

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
    WikiApi.getWiki(href)
      .then(source => this.setState({ source }));
  }

  render() {
    const { source } = this.state;
    return (
      <MarkdownViewer source={source} onClickLink={href => this.loadMarkdown(href)} />
    );
  }
}

export default WikiViewer;

