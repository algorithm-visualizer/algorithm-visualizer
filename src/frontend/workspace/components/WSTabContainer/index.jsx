import React from 'react';
import { DropTarget } from 'react-dnd';
import { classes } from '/common/util';
import styles from './stylesheet.scss';
import TabBar from './TabBar';
import TabTitle from './TabTitle';

const tabContainerTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const { tab } = item;
    component.core.addChild(tab);
  }
};

@DropTarget('tab', tabContainerTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
class WSTabContainer extends React.Component {
  constructor(props) {
    super(props);

    const { core } = props;
    core.reference.component = this;
    this.core = core;
  }

  handleOnClickTab(tabIndex) {
    this.core.setTabIndex(tabIndex);
  }

  render() {
    const { className, connectDropTarget, isOver } = this.props;
    const { children, tabIndex } = this.core;

    return connectDropTarget(
      <div className={classes(styles.tab_container, isOver && styles.dropping, className)}>
        <TabBar className={styles.tab_bar} section={this.core}>
          <div className={classes(styles.title, styles.fake)} />
          {
            children.map((tab, i) => {
              const { title } = tab;
              const selected = i === tabIndex;
              return (
                <TabTitle className={classes(styles.title, selected && styles.selected)} key={i}
                          onClick={() => this.handleOnClickTab(i)} tab={tab}>
                  {title}
                </TabTitle>
              );
            })
          }
          <div className={classes(styles.title, styles.fake)} />
        </TabBar>
        <div className={styles.content}>
          {
            ~tabIndex ? children[tabIndex].element : null
          }
        </div>
      </div>
    );
  }
}

export default WSTabContainer;

