import React from 'react';
import { classes } from '/common/util';
import { Section } from '/components';
import styles from './stylesheet.scss';

class SectionContainer extends React.Component {
  render() {
    const { className, children, horizontal, style } = this.props;

    return (
      <Section className={classes(styles.section_container, horizontal && styles.horizontal, className)} style={style}>
        {children}
      </Section>
    );
  }
}

export default SectionContainer;
