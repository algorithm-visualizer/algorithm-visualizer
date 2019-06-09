import React from 'react';
import styles from './Ellipsis.module.scss';
import { classes } from 'common/util';

class Ellipsis extends React.Component {
  render() {
    const { className, children } = this.props;

    return (
      <span className={classes(styles.ellipsis, className)}>
        {children}
      </span>
    );
  }
}

export default Ellipsis;

