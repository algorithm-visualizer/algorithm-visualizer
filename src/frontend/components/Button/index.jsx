import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './stylesheet.scss';
import { classes } from '/common/util';
import { Link } from 'react-router-dom';

class Button extends React.Component {
  render() {
    const { className, children, onClick, to, href, icon, reverse, selected, disabled, primary, active, ...rest } = this.props;

    const iconOnly = !children;
    const props = {
      className: classes(styles.button, reverse && styles.reverse, selected && styles.selected, disabled && styles.disabled, primary && styles.primary, active && styles.active, iconOnly && styles.icon_only, className),
      onClick: disabled ? null : onClick,
      href: disabled ? null : href,
      children: [
        icon && (
          typeof icon === 'string' ?
            <div className={classes(styles.icon, styles.image)} key="icon"
                 style={{ backgroundImage: `url(${icon})` }} /> :
            <FontAwesomeIcon className={styles.icon} fixedWidth icon={icon} key="icon" />
        ),
        children,
      ],
      ...rest,
    };

    return to ? (
      <Link to={to} {...props} />
    ) : href ? (
      /^https?:\/\//i.test(href) ? (
        <a href={href} rel="noopener" target="_blank" {...props} />
      ) : (
        <a href={href} {...props} />
      )
    ) : (
      <div {...props} />
    );
  }
}

export default Button;

