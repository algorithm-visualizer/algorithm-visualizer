import React from 'react';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class TabContainer extends React.Component {
  render() {
    const { className, children, titles, tabIndex, onChangeTabIndex } = this.props;

    return (
      <div className={classes(styles.tab_container, className)}>
        <div className={styles.tab_bar}>
          <div className={classes(styles.title, styles.fake)} />
          {
            titles.map((title, i) => {
              const selected = i === tabIndex;
              return (
                <div className={classes(styles.title, selected && styles.selected)} key={i}
                     onClick={() => onChangeTabIndex(i)}>
                  {title}
                </div>
              );
            })
          }
          <div className={classes(styles.title, styles.fake)} />
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

export default TabContainer;
