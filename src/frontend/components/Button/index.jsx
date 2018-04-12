import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import styles from './stylesheet.scss';
import { classes } from '/common/util';

class Button extends React.Component {
  render() {
    const { className, children, onClick, href, icon, reverse, selected, disabled, primary, active } = this.props;

    const iconOnly = !children;
    const props = {
      className: classes(styles.button, reverse && styles.reverse, selected && styles.selected, disabled && styles.disabled, primary && styles.primary, active && styles.active, iconOnly && styles.icon_only, className),
      onClick: disabled ? null : onClick,
      href: disabled ? null : href,
      children: [
        icon && <FontAwesomeIcon className={styles.icon} fixedWidth icon={icon} key="icon" />,
        children,
      ]
    };

    return href ? (
      <a href={href} rel="noopener" target="_blank" {...props} />
    ) : (
      <div {...props} />
    );
  }
}

export default Button;

