import React from 'react';
import { Renderer } from '/core/renderers';
import styles from './stylesheet.scss';
import ReactMarkdown from 'react-markdown';

class MarkdownRenderer extends Renderer {
  renderData() {
    const { markdown } = this.props.data;

    const link = ({ href, ...rest }) => {
      return (
        <a href={href} rel="noopener" target="_blank" {...rest} />
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
      return <img src={newSrc} style={{ maxWidth: '100%' }} {...rest} />;
    };

    return (
      <ReactMarkdown className={styles.markdown} source={markdown} renderers={{ link, image }} escapeHtml={false} />
    );
  }
}

export default MarkdownRenderer;

