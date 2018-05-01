import React from 'react';
import { connect } from 'react-redux';
import { actions as envActions } from '/reducers/env';
import { HierarchyApi } from '/apis/index';
import { ContributorsViewer, MarkdownViewer } from '/components';
import styles from './stylesheet.scss';
import { classes } from '/common/util';

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
      file: null,
    };
  }

  componentDidMount() {
    const { categoryKey, algorithmKey } = this.props.env;
    const href = `/algorithm/${categoryKey}/${algorithmKey}`;
    this.loadFile(href);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey) {
      const href = `/algorithm/${categoryKey}/${algorithmKey}`;
      this.loadFile(href);
    }
  }

  loadFile(href) {
    const [, , categoryKey, algorithmKey] = href.split('/');
    HierarchyApi.getFile(categoryKey, algorithmKey, 'desc.md')
      .then(({ file }) => this.setState({ file }))
      .catch(() => this.setState({ file: null }));
  }

  render() {
    const { className } = this.props;
    const { file } = this.state;
    return file && (
      <div className={classes(styles.description_viewer, className)}>
        <MarkdownViewer className={styles.markdown_viewer} source={file.content} onClickLink={href => this.loadFile(href)} />
        <ContributorsViewer contributors={file.contributors} />
      </div>
    );
  }
}

export default DescriptionViewer;
