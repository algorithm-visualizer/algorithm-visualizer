import React from 'react';
import ReactMarkdown from 'react-markdown'
import { classes } from '/common/util';
import { WikiApi } from '/apis';
import styles from './stylesheet.scss';

class WikiViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wiki: null,
    };
  }

  componentDidMount() {
    this.loadWiki('Tracer');
  }

  loadWiki(wikiKey) {
    WikiApi.getWiki(wikiKey)
      .then(({ wiki }) => this.setState({ wiki: `# ${wikiKey}\n${wiki}` }));
  }

  render() {
    const { className } = this.props;
    const { wiki } = this.state;

    const InnerLink = ({ href, ...rest }) => {
      return /^\w+$/.test(href) ? (
        <a {...rest} onClick={() => this.loadWiki(href)} />
      ) : (
        <a href={href} rel="noopener" target="_blank" {...rest} />
      );
    };

    return (
      <div className={classes(styles.wiki_viewer, className)}>
        <ReactMarkdown className={styles.markdown} source={wiki} renderers={{ link: InnerLink }} />
      </div>
    );
  }
}

export default WikiViewer;

