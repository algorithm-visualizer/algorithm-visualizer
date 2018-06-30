import React from 'react';
import { classes } from '/common/util';
import { WSSectionContainer } from '/workspace/components';
import { Parent, SectionContainer } from '/workspace/core';
import styles from './stylesheet.scss';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.sectionContainer = new SectionContainer(this.getElement(props));
  }

  componentDidMount() {
    this.handleChangeElement(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleChangeElement(nextProps);
  }

  getElement(props) {
    const { className, wsProps, ...rest } = props;
    return (
      <WSSectionContainer className={classes(styles.workspace, className)}
                          wsProps={{ id: 'workspace', removable: false, ...wsProps }} {...rest} />
    );
  }

  handleChangeElement(props) {
    const element = this.getElement(props);

    const unmark = section => {
      section.updated = false;
      if (section instanceof Parent) {
        section.children.forEach(unmark);
      }
    };
    unmark(this.sectionContainer);

    console.log('----');
    const update = (element, parentSection) => {
      const { children = [], wsProps = {} } = element.props;
      const id = wsProps.id || `${parentSection.id}-${element.key}`;
      if (id.startsWith('workspace-.1-.1-.1-')) console.log(id.slice('workspace-.1-.1-.1-'.length));
      let section = this.findSectionById(id);
      if (section) {
        section.setElement(element);
      } else {
        section = parentSection.childify(React.cloneElement(element, { wsProps: { ...wsProps, id } }));
        parentSection.addChild(section);
      }
      section.updated = true;
      if (section instanceof Parent) {
        React.Children.toArray(children).forEach(element => update(element, section));
      }
    };
    update(element);

    const removeUnmarked = section => {
      if (!section.updated) {
        section.remove();
      } else if (section instanceof Parent) {
        section.children.forEach(removeUnmarked);
      }
    };
    removeUnmarked(this.sectionContainer);
  }

  findSectionById(id, section = this.sectionContainer) {
    if (section.id === id) return section;
    if (section instanceof Parent) {
      for (const childSection of section.children) {
        const foundSection = this.findSectionById(id, childSection);
        if (foundSection) return foundSection;
      }
    }
  }

  render() {
    return this.sectionContainer.element;
  }
}

export default Workspace;
