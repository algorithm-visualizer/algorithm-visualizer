import React from 'react';

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleError = this.handleError.bind(this);
  }

  handleError(error) {
    console.error(error);
    if (error.response) {
      const { data } = error.response;
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.props.showErrorToast(message);
    } else {
      this.props.showErrorToast(error.message);
    }
  }
}

export default BaseComponent;
