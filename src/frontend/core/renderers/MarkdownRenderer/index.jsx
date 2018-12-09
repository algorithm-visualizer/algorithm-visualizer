import React from 'react';
import { Renderer } from '/core/renderers';
import styles from './stylesheet.scss';
import ReactMarkdown from 'react-markdown';

class MarkdownRenderer extends Renderer {
  renderData() {
    const { markdown } = this.props.data;

    const heading = ({ level, children, ...rest }) => {
      const HeadingComponent = [
        props => <h1 {...props} />,
        props => <h2 {...props} />,
        props => <h3 {...props} />,
        props => <h4 {...props} />,
        props => <h5 {...props} />,
        props => <h6 {...props} />,
      ][level - 1];

      const idfy = text => text.toLowerCase().trim().replace(/[^\w \-]/g, '').replace(/ /g, '-');

      const getText = children => {
        return children ? children.filter(child => child).map(child => {
          if (typeof child === 'string') return child;
          if ('props' in child) return getText(child.props.children);
          return '';
        }).join('') : '';
      };

      const id = idfy(getText(children));

      return (
        <HeadingComponent id={id} {...rest}>
          {children}
        </HeadingComponent>
      );
    };

    const link = ({ href, ...rest }) => {
      return /^#/.test(href) ? (
        <a href={href} {...rest} />
      ) : (
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
      <ReactMarkdown className={styles.markdown} source={markdown} renderers={{ heading, link, image }}
                     escapeHtml={false} />
    );
  }
}

export default MarkdownRenderer;

