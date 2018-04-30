import React from 'react';
import { connect } from 'react-redux';
import { actions as envActions } from '/reducers/env';
import { DirectoryApi } from '/apis/index';
import { MarkdownViewer } from '/components';

@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions
  }
)
class DescriptionViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
    };
  }

  componentDidMount() {
    const { categoryKey, algorithmKey } = this.props.env;
    const href = `/algorithm/${categoryKey}/${algorithmKey}`;
    this.loadMarkdown(href);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey) {
      const href = `/algorithm/${categoryKey}/${algorithmKey}`;
      this.loadMarkdown(href);
    }
  }

  loadMarkdown(href) {
    const [, , categoryKey, algorithmKey] = href.split('/');
    DirectoryApi.getFile(categoryKey, algorithmKey, 'desc.md')
      .then(source => this.setState({ source }));
  }

  render() {
    const { source } = this.state;
    return (
      <MarkdownViewer source={source} onClickLink={href => this.loadMarkdown(href)} />
    );
  }
}

export default DescriptionViewer;
