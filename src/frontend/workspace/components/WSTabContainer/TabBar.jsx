import React from 'react';
import { DragSource } from 'react-dnd';

const sectionSource = {
  beginDrag(props, monitor, component) {
    return {
      section: props.section
    };
  },
};

@DragSource('section', sectionSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
}))
class TabBar extends React.Component {
  render() {
    const { section, connectDragSource, ...props } = this.props;

    return connectDragSource(<div {...props} />);
  }
}

export default TabBar;

