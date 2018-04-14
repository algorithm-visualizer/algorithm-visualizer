import React from 'react';
import { classes } from '/common/util';
import { Button, Section } from '/components';
import styles from './stylesheet.scss';

class TabSection extends React.Component {
  render() {
    const { className, children, titles, tabIndex, onChangeTabIndex, style } = this.props;

    return (
      <Section className={classes(styles.tab_section, className)} style={style}>
        <div className={styles.tab_bar}>
          {
            titles.map((title, i) => {
              const selected = tabIndex === i;
              return (
                <Button className={classes(styles.title, selected && styles.selected)} key={i}
                        onClick={() => onChangeTabIndex(i)}>
                  {title}
                </Button>
              )
            })
          }
        </div>
        <div className={styles.content} data-tab_index={tabIndex}>
          {children}
        </div>
      </Section>
    );
  }
}

export default TabSection;

