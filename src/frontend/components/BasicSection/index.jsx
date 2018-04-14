import React from 'react';
import { classes } from '/common/util';
import { Section } from '/components';
import styles from './stylesheet.scss';

class BasicSection extends React.Component {
  render() {
    const { className, Component, style, relativeWeight } = this.props;

    return (
      <Section className={classes(styles.basic_section, className)} style={style}>
        <Component className={styles.component} relativeWeight={relativeWeight} />
      </Section>
    );
  }
}

export default BasicSection;
