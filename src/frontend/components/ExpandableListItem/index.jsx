import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import styles from './stylesheet.scss';
import { Ellipsis, ListItem } from '/components';
import { classes } from '/common/util';

class ExpandableListItem extends React.Component {
  render() {
    const { className, children, label, opened, ...props } = this.props;

    return opened ? (
      <div className={classes(styles.expandable_list_item, className)}>
        <ListItem className={styles.category} {...props}>
          <Ellipsis className={styles.label}>{label}</Ellipsis>
          <FontAwesomeIcon fixedWidth icon={faCaretDown} />
        </ListItem>
        {children}
      </div>
    ) : (
      <ListItem className={classes(styles.category, className)} {...props}>
        <Ellipsis className={styles.label}>{label}</Ellipsis>
        <FontAwesomeIcon fixedWidth icon={faCaretRight} />
      </ListItem>
    );
  }
}

export default ExpandableListItem;

