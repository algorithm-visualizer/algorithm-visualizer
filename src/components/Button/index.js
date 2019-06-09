import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import { classes } from 'common/util';
import { Ellipsis } from 'components';
import styles from './Button.module.scss';

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirming: false,
    };

    this.timeout = null;
  }

  componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  render() {
    let { className, children, to, href, onClick, icon, reverse, selected, disabled, primary, active, confirmNeeded, inProgress, ...rest } = this.props;
    const { confirming } = this.state;

    if (confirmNeeded) {
      if (confirming) {
        className = classes(styles.confirming, className);
        icon = faExclamationCircle;
        children = <Ellipsis key="text">Click to Confirm</Ellipsis>;
        const onClickOriginal = onClick;
        onClick = () => {
          if (onClickOriginal) onClickOriginal();
          if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = undefined;
            this.setState({ confirming: false });
          }
        };
      } else {
        to = null;
        href = null;
        onClick = () => {
          this.setState({ confirming: true });
          this.timeout = window.setTimeout(() => {
            this.timeout = undefined;
            this.setState({ confirming: false });
          }, 2000);
        };
      }
    }

    const iconOnly = !children;
    const props = {
      className: classes(styles.button, reverse && styles.reverse, selected && styles.selected, disabled && styles.disabled, primary && styles.primary, active && styles.active, iconOnly && styles.icon_only, className),
      to: disabled ? null : to,
      href: disabled ? null : href,
      onClick: disabled ? null : onClick,
      children: [
        icon && (
          typeof icon === 'string' ?
            <div className={classes(styles.icon, styles.image)} key="icon"
                 style={{ backgroundImage: `url(${icon})` }} /> :
            <FontAwesomeIcon className={styles.icon} fixedWidth icon={inProgress ? faSpinner : icon} spin={inProgress}
                             key="icon" />
        ),
        children,
      ],
      ...rest,
    };

    return to ? (
      <Link {...props} />
    ) : href ? (
      <a rel="noopener" target="_blank" {...props} />
    ) : (
      <div {...props} />
    );
  }
}

export default Button;

