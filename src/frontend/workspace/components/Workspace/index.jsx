import React from 'react';
import { classes } from '/common/util';
import { WSSectionContainer } from '/workspace/components';
import { SectionContainer } from '/workspace/core';
import styles from './stylesheet.scss';

class Workspace extends React.Component {
  static createReference() {
    return {
      core: null,
      component: null,
    };
  }

  constructor(props) {
    super(props);

    const { className, children, wsProps } = props;
    this.sectionContainer = new SectionContainer(
      <WSSectionContainer className={classes(styles.workspace, className)}
                          wsProps={{ removable: false, ...wsProps }}>
        {children}
      </WSSectionContainer>
    );
  }

  render() {
    return this.sectionContainer.element;
  }
}

export default Workspace;
