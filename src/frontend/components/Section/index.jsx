import React from 'react';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class Section extends React.Component {
  render() {
    const { className, children, style } = this.props;

    return (
      <section className={classes(styles.section, className)} style={style}>
        {children}
      </section>
    );
  }
}

export default Section;
