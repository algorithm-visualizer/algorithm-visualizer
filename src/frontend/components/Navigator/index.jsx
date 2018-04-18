import React from 'react';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faBook from '@fortawesome/fontawesome-free-solid/faBook';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { ExpandableListItem, ListItem } from '/components';
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
class Navigator extends React.Component {
  constructor(props) {
    super(props);

    const { categoryKey } = this.props.env;

    this.state = {
      categoriesOpened: {
        [categoryKey]: true,
      },
      query: '',
    }
  }

  toggleCategory(key, categoryOpened = !this.state.categoriesOpened[key]) {
    const categoriesOpened = {
      ...this.state.categoriesOpened,
      [key]: categoryOpened,
    };
    this.setState({ categoriesOpened });
  }

  handleChangeQuery(e) {
    const { categories } = this.props.env;
    const categoriesOpened = {};
    const query = e.target.value;
    categories.forEach(category => {
      if (this.testQuery(name) || category.algorithms.find(algorithm => this.testQuery(algorithm.name))) {
        categoriesOpened[category.key] = true;
      }
    });

    this.setState({ categoriesOpened, query });
  }

  testQuery(value) {
    const { query } = this.state;
    return new RegExp(query, 'i').test(value);
  }

  render() {
    const { categoriesOpened, query } = this.state;
    const { className, style } = this.props;
    const { categoryKey: selectedCategoryKey, algorithmKey: selectedAlgorithmKey, categories } = this.props.env;

    return (
      <nav className={classes(styles.navigator, className)} style={style}>
        <div className={styles.search_bar_container}>
          <FontAwesomeIcon fixedWidth icon={faSearch} className={styles.search_icon} />
          <input type="text" className={styles.search_bar} autoFocus placeholder="Search ..." value={query}
                 onChange={e => this.handleChangeQuery(e)} />
        </div>
        <div className={styles.algorithm_list}>
          {
            categories.map(category => {
              const categoryOpened = categoriesOpened[category.key];
              let algorithms = category.algorithms;
              if (!this.testQuery(category.name)) {
                algorithms = algorithms.filter(algorithm => this.testQuery(algorithm.name));
                if (!algorithms.length) return null;
              }
              return (
                <ExpandableListItem key={category.key} onClick={() => this.toggleCategory(category.key)}
                                    label={category.name}
                                    opened={categoryOpened}>
                  {
                    algorithms.map(algorithm => {
                      const selected = category.key === selectedCategoryKey && algorithm.key === selectedAlgorithmKey;
                      return (
                        <ListItem indent key={algorithm.key} selected={selected}
                                  to={`/${category.key}/${algorithm.key}`} label={algorithm.name} />
                      )
                    })
                  }
                </ExpandableListItem>
              );
            })
          }
        </div>
        <div className={styles.footer}>
          <ListItem icon={faCode} label="Scratch Paper" />
          <ListItem icon={faBook} label="Tracer API" />
          <ListItem icon={faGithub} label="Fork me on GitHub" href="https://github.com/parkjs814/AlgorithmVisualizer" />
        </div>
      </nav>
    );
  }
}

export default Navigator;