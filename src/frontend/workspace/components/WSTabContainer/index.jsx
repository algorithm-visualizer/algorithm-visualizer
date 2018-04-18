import React from 'react';
import { classes } from '/common/util';
import { Button } from '/components';
import { draggingData } from '/workspace/core';
import { Droppable } from '/workspace/components';
import styles from './stylesheet.scss';

class WSTabContainer extends React.Component {
  constructor(props) {
    super(props);

    const { core } = props;
    core.reference.component = this;
    this.core = core;
  }

  setDraggingTab(e, tab) {
    e.stopPropagation();
    draggingData.set(e, {
      type: 'tab',
      tab,
    });
  }

  setDraggingSection(e) {
    e.stopPropagation();
    draggingData.set(e, {
      type: 'section',
      section: this.section,
    })
  }


  handleOnClickTab(tabIndex) {
    this.core.setTabIndex(tabIndex);
  }

  handleDropTab(tab) {
    this.core.addChild(tab);
  }

  render() {
    const { className } = this.props;
    const { children, tabIndex } = this.core;

    return (
      <Droppable className={classes(styles.tab_container, className)}
                 droppingClassName={styles.dropping}
                 onDropTab={tab => this.handleDropTab(tab)}>
        <div className={styles.tab_bar}
             draggable={true}
             onDragStart={e => this.setDraggingSection(e)}>
          <div className={classes(styles.title, styles.fake)} />
          {
            children.map((tab, i) => {
              const { title } = tab;
              const selected = i === tabIndex;
              return (
                <Button className={classes(styles.title, selected && styles.selected)}
                        onClick={() => this.handleOnClickTab(i)}
                        draggable={true} key={i}
                        onDragStart={e => this.setDraggingTab(e, tab)}>
                  {title}
                </Button>
              );
            })
          }
          <div className={classes(styles.title, styles.fake)} />
        </div>
        <div className={styles.content}>
          {
            ~tabIndex ? children[tabIndex].element : null
          }
        </div>
      </Droppable>
    );
  }
}

export default WSTabContainer;

