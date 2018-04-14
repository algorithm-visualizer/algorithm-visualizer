import React from 'react';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import { classes } from '/common/util';
import { Button, Section } from '/components';
import styles from './stylesheet.scss';

class TabSection extends React.Component {
  render() {
    const { className, tabs, tabIndex, onChangeTabIndex, style, relativeWeight } = this.props;

    const prevIndex = (tabIndex - 1 + tabs.length) % tabs.length;
    const nextIndex = (tabIndex + 1) % tabs.length;

    return (
      <Section className={classes(styles.tab_section, className)} style={style}>
        <div className={styles.tab_bar}>
          <Button className={styles.tab} icon={faAngleLeft} onClick={() => onChangeTabIndex(prevIndex)} />
          <div className={styles.wrapper}>
            {
              tabs.map((tab, i) => {
                const { id, title } = tab;
                const selected = tabIndex === i;
                return (
                  <Button className={classes(styles.title, selected && styles.selected)} key={id}
                          onClick={() => onChangeTabIndex(i)}>
                    {title}
                  </Button>
                )
              })
            }
          </div>
          <Button className={styles.tab} icon={faAngleRight} onClick={() => onChangeTabIndex(nextIndex)} />
        </div>
        <div className={styles.content} data-tab_index={tabIndex}>
          {
            tabs.map((tab, i) => {
              const { id, Component } = tab;
              const selected = tabIndex === i;
              return <Component key={id} className={classes(styles.tab, selected && styles.selected)}
                                relativeWeight={relativeWeight} />;
            })
          }
        </div>
      </Section>
    );
  }
}

export default TabSection;

