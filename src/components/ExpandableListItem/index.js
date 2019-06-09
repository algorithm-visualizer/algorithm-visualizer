import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import styles from './ExpandableListItem.module.scss';
import { ListItem } from 'components';
import { classes } from 'common/util';

class ExpandableListItem extends React.Component {
  render() {
    const { className, children, opened, ...props } = this.props;

    return opened ? (
      <div className={classes(styles.expandable_list_item, className)}>
        <ListItem className={styles.category} {...props}>
          <FontAwesomeIcon className={styles.icon} fixedWidth icon={faCaretDown} />
        </ListItem>
        {children}
      </div>
    ) : (
      <ListItem className={classes(styles.category, className)} {...props}>
        <FontAwesomeIcon className={styles.icon} fixedWidth icon={faCaretRight} />
      </ListItem>
    );
  }
}

export default ExpandableListItem;

