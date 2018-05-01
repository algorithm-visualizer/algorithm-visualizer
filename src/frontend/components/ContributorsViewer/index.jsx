import React from 'react';
import { classes } from '/common/util';
import styles from './stylesheet.scss';
import { Button } from '/components';

class ContributorsViewer extends React.Component {
  render() {
    const { className, contributors } = this.props;

    return (
      <div className={classes(styles.contributors_viewer, className)}>
        <span className={classes(styles.contributor, styles.label)}>Contributed by</span>
        {
          contributors.map(contributor => (
            <Button className={styles.contributor} icon={contributor.avatar_url} key={contributor.login}
                    href={`https://github.com/${contributor.login}`}>
              {contributor.login}
            </Button>
          ))
        }
      </div>
    );
  }
}

export default ContributorsViewer;

