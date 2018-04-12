import React from 'react';
import { connect } from 'react-redux';
import { classes } from '/common/util';
import { actions as envActions } from '/reducers/env';
import styles from './stylesheet.scss';

@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions
  }
)
class DescriptionViewer extends React.Component {
  getChild(value) {
    if (typeof value === 'string') {
      return (
        <p>{value}</p>
      );
    } else if (Array.isArray(value)) {
      return (
        <ul className={styles.applications}>
          {
            value.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
            ))
          }
        </ul>
      );
    } else if (typeof value === 'object') {
      return (
        <ul>
          {
            Object.keys(value).map((key, i) => (
              <li className={styles.complexity} key={i}>
                <span className={styles.complexity_type}>{key}: </span>
                <span>{value[key]}</span>
              </li>
            ))
          }
        </ul>
      );
    }
  }

  render() {
    const { className } = this.props;
    const { algorithm } = this.props.env;

    return (
      <div className={classes(styles.description_viewer, className)}>
        {
          Object.keys(algorithm).map((key, i) => {
            if (key === 'files') return null;
            const value = algorithm[key];
            return (
              <div key={i}>
                <h3>{key}</h3>
                {this.getChild(value)}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default DescriptionViewer;

