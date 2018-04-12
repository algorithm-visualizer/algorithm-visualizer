import React from 'react';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import { Button } from '/components';
import { classes } from '/common/util';
import styles from './stylesheet.scss';

class TabBar extends React.Component {
  render() {
    const { className, titles, selectedIndex, onClickTab } = this.props;

    return (
      <div className={classes(styles.tab_bar, className)}>
        <Button className={styles.tab} icon={faAngleLeft}
                onClick={() => onClickTab((selectedIndex - 1 + titles.length) % titles.length)} />
        <div className={styles.wrapper}>
          {
            titles.map((title, i) => {
              const selected = selectedIndex === i;
              return (
                <Button className={classes(styles.tab, selected && styles.selected)}
                        onClick={() => onClickTab(i)} key={i}>{title}</Button>
              )
            })
          }
        </div>
        <Button className={styles.tab} icon={faAngleRight}
                onClick={() => onClickTab((selectedIndex + 1) % titles.length)} />
      </div>
    );
  }
}

export default TabBar;

