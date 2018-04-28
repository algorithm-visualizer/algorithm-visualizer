import React from 'react';
import { DragSource } from 'react-dnd';

const tabSource = {
  beginDrag(props, monitor, component) {
    return {
      tab: props.tab
    };
  },
};

@DragSource('tab', tabSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
}))
class TabTitle extends React.Component {
  render() {
    const { tab, connectDragSource, ...props } = this.props;

    return connectDragSource(<div {...props} />);
  }
}

export default TabTitle;

