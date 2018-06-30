import React from 'react';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { ExpandableListItem, ListItem } from '/components';
import { classes } from '/common/util';
import { actions as envActions } from '/reducers/env';
import { actions as toastActions } from '/reducers/toast';
import styles from './stylesheet.scss';
import { ALGORITHM_NEW, CATEGORY_SCRATCH_PAPER } from '/common/config';

@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions,
    ...toastActions,
  }
)
class Navigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesOpened: {},
      scratchPaperOpened: false,
      favoritesOpened: false,
      query: '',
    }
  }

  componentDidMount() {
    const { categoryKey } = this.props.env;
    if (categoryKey) {
      this.toggleCategory(categoryKey, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey } = nextProps.env;
    if (categoryKey) {
      this.toggleCategory(categoryKey, true);
    }
  }

  toggleCategory(key, categoryOpened = !this.state.categoriesOpened[key]) {
    const categoriesOpened = {
      ...this.state.categoriesOpened,
      [key]: categoryOpened,
    };
    this.setState({ categoriesOpened });
  }

  toggleScratchPaper(scratchPaperOpened = !this.state.scratchPaperOpened) {
    this.setState({ scratchPaperOpened });
  }

  toggleFavorites(favoritesOpened = !this.state.favoritesOpened) {
    this.setState({ favoritesOpened });
  }

  handleChangeQuery(e) {
    const { hierarchy } = this.props.env;
    const categoriesOpened = {};
    const query = e.target.value;
    hierarchy.forEach(category => {
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
    const { categoriesOpened, scratchPaperOpened, favoritesOpened, query } = this.state;
    const { className, style } = this.props;
    const { hierarchy, categoryKey, algorithmKey, signedIn } = this.props.env;

    return (
      <nav className={classes(styles.navigator, className)} style={style}>
        <div className={styles.search_bar_container}>
          <FontAwesomeIcon fixedWidth icon={faSearch} className={styles.search_icon} />
          <input type="text" className={styles.search_bar} autoFocus placeholder="Search ..." value={query}
                 onChange={e => this.handleChangeQuery(e)} />
        </div>
        <div className={styles.algorithm_list}>
          {
            hierarchy && hierarchy.map(category => {
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
                      const selected = category.key === categoryKey && algorithm.key === algorithmKey;
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
          {
            signedIn ?
              <ExpandableListItem icon={faCode} label="Scratch Paper" onClick={() => this.toggleScratchPaper()}
                                  opened={scratchPaperOpened}>
                <ListItem indent label="New ..." to={`/${CATEGORY_SCRATCH_PAPER}/${ALGORITHM_NEW}`} />
              </ExpandableListItem> :
              <ListItem icon={faCode} label="Scratch Paper"
                        onClick={() => this.props.showSuccessToast('Sign In Required')} />
          }
          {
            signedIn ?
              <ExpandableListItem icon={faStar} label="Favorites" onClick={() => this.toggleFavorites()}
                                  opened={favoritesOpened} /> :
              <ListItem icon={faStar} label="Favorites"
                        onClick={() => this.props.showSuccessToast('Sign In Required')} />
          }
          <ListItem icon={faGithub} label="Fork me on GitHub"
                    href="https://github.com/algorithm-visualizer/algorithm-visualizer" />
        </div>
      </nav>
    );
  }
}

export default Navigator;