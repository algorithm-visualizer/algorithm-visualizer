import React from 'react';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import { Button } from '/components';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class TabBar extends React.Component {
  render() {
    const { className, tabs, tabIndex } = this.props;

    const prevIndex = (tabIndex - 1 + tabs.length) % tabs.length;
    const nextIndex = (tabIndex + 1) % tabs.length;

    return (
      <div className={classes(styles.tab_bar, className)}>
        <Button className={styles.tab} icon={faAngleLeft} {...tabs[prevIndex].props} />
        <div className={styles.wrapper}>
          {
            tabs.map((tab, i) => {
              const { title, props } = tab;
              const selected = tabIndex === i;
              return (
                <Button className={classes(styles.tab, selected && styles.selected)} key={i} {...props}>{title}</Button>
              )
            })
          }
        </div>
        <Button className={styles.tab} icon={faAngleRight} {...tabs[nextIndex].props} />
      </div>
    );
  }
}

export default TabBar;

