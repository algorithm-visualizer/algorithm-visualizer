import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faBook from '@fortawesome/fontawesome-free-solid/faBook';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { ExpandableListItem, ListItem } from '/components';
import { classes } from '/common/util';
import { actions } from '/reducers';
import styles from './stylesheet.scss';

@connect(({ current, directory, env }) => ({ current, directory, env }), actions)
class Navigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesOpened: {},
      scratchPaperOpened: true,
      query: '',
    }
  }

  componentDidMount() {
    const { categoryKey } = this.props.current;
    if (categoryKey) {
      this.toggleCategory(categoryKey, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { categoryKey } = nextProps.current;
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

  handleChangeQuery(e) {
    const { categories } = this.props.directory;
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
    const { categoriesOpened, scratchPaperOpened, query } = this.state;
    const { className, loadAlgorithm } = this.props;
    const { categories, scratchPapers } = this.props.directory;
    const { categoryKey, algorithmKey, gistId } = this.props.current;
    const { signedIn, ext } = this.props.env;

    return (
      <nav className={classes(styles.navigator, className)}>
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
                    algorithms.map(algorithm => (
                      <ListItem indent key={algorithm.key}
                                selected={category.key === categoryKey && algorithm.key === algorithmKey}
                                onClick={() => loadAlgorithm({
                                  categoryKey: category.key,
                                  algorithmKey: algorithm.key,
                                })} label={algorithm.name} />
                    ))
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
                <ListItem indent label="New ..." onClick={() => loadAlgorithm({ gistId: 'new' })} />
                {
                  scratchPapers.map(scratchPaper => (
                    <ListItem indent key={scratchPaper.key} selected={scratchPaper.key === gistId}
                              onClick={() => loadAlgorithm({ gistId: scratchPaper.key })} label={scratchPaper.name} />
                  ))
                }
              </ExpandableListItem> :
              <ListItem icon={faCode} label="Scratch Paper"
                        onClick={() => this.props.showSuccessToast('Sign In Required')} />
          }
          <ListItem icon={faBook} label="Tracers API"
                    href="https://github.com/algorithm-visualizer/tracers/wiki" />
          <ListItem icon={faGithub} label="Fork me on GitHub"
                    href="https://github.com/algorithm-visualizer/algorithm-visualizer" />
        </div>
      </nav>
    );
  }
}

export default Navigator;