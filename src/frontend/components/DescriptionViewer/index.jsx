import React from 'react';
import { connect } from 'react-redux';
import { classes } from '/common/util';
import { actions as envActions } from '/reducers/env';
import styles from './stylesheet.scss';
import { DirectoryApi } from '/apis/index';

@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions
  }
)
class DescriptionViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: null,
    };
  }

  componentDidMount() {
    const { categoryKey, algorithmKey } = this.props.env;
    this.loadDescription(categoryKey, algorithmKey);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey, algorithmKey } = nextProps.env;
    if (categoryKey !== this.props.env.categoryKey ||
      algorithmKey !== this.props.env.algorithmKey) {
      this.loadDescription(categoryKey, algorithmKey);
    }
  }

  loadDescription(categoryKey, algorithmKey) {
    DirectoryApi.getDescription(categoryKey, algorithmKey)
      .then(({ description }) => this.setState({ description }));
  }

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
    const { description } = this.state;
    const { className } = this.props;

    return description && (
      <div className={classes(styles.description_viewer, className)}>
        {
          Object.keys(description).map((key, i) => {
            if (key === 'files') return null;
            const value = description[key];
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

