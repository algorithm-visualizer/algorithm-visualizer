import React from 'react';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faBook from '@fortawesome/fontawesome-free-solid/faBook';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { Ellipsis, ExpandableListItem, ListItem } from '/components';
import { classes } from '/common/util';
import { actions as envActions } from '/reducers/env';
import 'github-fork-ribbon-css/gh-fork-ribbon.css';
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
      poweredByOpened: false,
      categoriesOpened: {
        [categoryKey]: true,
      },
      query: '',
    }
  }

  togglePoweredBy(poweredByOpened = !this.state.poweredByOpened) {
    this.setState({ poweredByOpened });
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
    Object.keys(categories).forEach(categoryKey => {
      const { name, list } = categories[categoryKey];
      let algorithmKeys = Object.keys(list);
      if (this.testQuery(name) || algorithmKeys.find(algorithmKey => this.testQuery(list[algorithmKey]))) {
        categoriesOpened[categoryKey] = true;
      }
    });

    this.setState({ categoriesOpened, query });
  }

  testQuery(value) {
    const { query } = this.state;
    return new RegExp(query, 'i').test(value);
  }

  render() {
    const { poweredByOpened, categoriesOpened, query } = this.state;
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
            Object.keys(categories).map(categoryKey => {
              const { name, list } = categories[categoryKey];
              const categoryOpened = categoriesOpened[categoryKey];
              let algorithmKeys = Object.keys(list);
              if (!this.testQuery(name)) {
                algorithmKeys = algorithmKeys.filter(algorithmKey => this.testQuery(list[algorithmKey]));
                if (!algorithmKeys.length) return null;
              }
              return (
                <ExpandableListItem key={categoryKey} onClick={() => this.toggleCategory(categoryKey)} label={name}
                                    opened={categoryOpened}>
                  {
                    algorithmKeys.map(algorithmKey => {
                      const name = list[algorithmKey];
                      const selected = categoryKey === selectedCategoryKey && algorithmKey === selectedAlgorithmKey;
                      return (
                        <ListItem indent key={algorithmKey} selected={selected}
                                  onClick={() => this.props.selectAlgorithm(categoryKey, algorithmKey)}>
                          <Ellipsis>{name}</Ellipsis>
                        </ListItem>
                      )
                    })
                  }
                </ExpandableListItem>
              );
            })
          }
        </div>
        <div className={styles.footer}>
          <ListItem className={styles.scratch_paper} icon={faCode}>Scratch Paper</ListItem>
          <ListItem className={styles.documentation} icon={faBook}>Tracer API</ListItem>
          <ExpandableListItem icon={faGithub} onClick={() => this.togglePoweredBy()} label="Powered by ..."
                              opened={poweredByOpened}>
            <ListItem indent href="https://github.com/jquery/jquery">jquery/jquery</ListItem>
            <ListItem indent href="https://github.com/ajaxorg/ace">ajaxorg/ace</ListItem>
            <ListItem indent href="https://github.com/jacomyal/sigma.js">jacomyal/sigma.js</ListItem>
            <ListItem indent href="https://github.com/chartjs/Chart.js">chartjs/Chart.js</ListItem>
            <ListItem indent href="https://github.com/Daniel15/babel-standalone">Daniel15/babel-standalone</ListItem>
            <ListItem indent href="https://github.com/showdownjs/showdown">showdownjs/showdown</ListItem>
            <ListItem indent href="https://github.com/FortAwesome/Font-Awesome">FortAwesome/Font-Awesome</ListItem>
            <ListItem indent href="https://github.com/simonwhitaker/github-fork-ribbon-css">simonwhitaker/github-fork-ribbon-css</ListItem>
            <ListItem indent href="https://github.com/mathjax/MathJax">mathjax/MathJax</ListItem>
          </ExpandableListItem>
        </div>
        <a className={classes('github-fork-ribbon', 'right-bottom')}
           href="http://github.com/parkjs814/AlgorithmVisualizer" data-ribbon="Fork me on GitHub"
           title="Fork me on GitHub">Fork me on GitHub
        </a>
      </nav>
    );
  }
}

export default Navigator;