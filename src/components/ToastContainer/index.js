import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'reducers';
import { classes } from 'common/util';
import styles from './ToastContainer.module.scss';

class ToastContainer extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
  }

  componentDidUpdate(prevProps) {
    const { toasts } = this.props.toast;
    const { toasts: prevToasts } = prevProps.toast;
    
    if (toasts !== prevToasts) {
      clearTimeout(this.timeout);
      const newToasts = toasts.filter(toast => !prevToasts.includes(toast));
      if (newToasts.length > 0) {
        const latestToast = newToasts[newToasts.length - 1];
        this.timeout = setTimeout(() => this.props.hideToast(latestToast.id), 3000);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { className } = this.props;
    const { toasts } = this.props.toast;

    return (
      <div className={classes(styles.toast_container, className)}>
        {
          toasts.map(toast => (
            <div className={classes(styles.toast, styles[toast.type])} key={toast.id}>
              {toast.message}
            </div>
          ))
        }
      </div>
    );
  }
}

export default connect(({ toast }) => ({ toast }), actions)(
  ToastContainer,
);

