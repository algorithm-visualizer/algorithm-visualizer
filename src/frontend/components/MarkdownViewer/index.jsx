import React from 'react';
import ReactMarkdown from 'react-markdown'
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class MarkdownViewer extends React.Component {
  render() {
    const { className, source, onClickLink } = this.props;

    const link = ({ href, ...rest }) => {
      return !onClickLink || /^https?:\/\//i.test(href) ? (
        <a href={href} rel="noopener" target="_blank" {...rest} />
      ) : (
        <a onClick={() => onClickLink(href)} {...rest} />
      );
    };

    const image = ({ src, ...rest }) => {
      let newSrc;
      const codecogs = 'https://latex.codecogs.com/svg.latex?';
      if (src.startsWith(codecogs)) {
        const latex = src.substring(codecogs.length);
        newSrc = `${codecogs}\\color{White}${latex}`;
      } else {
        newSrc = src;
      }
      return <img src={newSrc} {...rest} />
    };

    return (
      <ReactMarkdown className={classes(styles.markdown_viewer, className)} source={source}
                     renderers={{ link, image }} escapeHtml={false} />
    );
  }
}

export default MarkdownViewer;

