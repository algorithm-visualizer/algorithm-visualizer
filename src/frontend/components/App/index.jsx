import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import { Divider, EditorSection, Header, Navigator, ToastContainer, ViewerSection } from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as envActions } from '/reducers/env';
import { calculatePercentageWidth } from '/common/util';
import { DirectoryApi } from '/apis';
import { tracerManager } from '/core';
import styles from './stylesheet.scss';
import 'axios-progress-bar/dist/nprogress.css'

loadProgressBar();

@connect(
  ({ toast, env }) => ({
    toast,
    env,
  }), {
    ...toastActions,
    ...envActions,
  }
)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigatorOpened: true,
      navigatorWidth: '16%',
      viewerSectionWidth: '50%',
    }
  }

  componentDidMount() {
    this.updateDirectory(this.props.match.params);

    DirectoryApi.getCategories()
      .then(({ categories }) => {
        this.props.setCategories(categories);
        const { categoryKey, algorithmKey } = this.props.env;
        const category = categories.find(category => category.key === categoryKey) || categories[0];
        const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey) || category.algorithms[0];
        this.props.history.push(`/${category.key}/${algorithm.key}`);
      });

    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      this.updateDirectory(nextProps.match.params);
    }
  }

  componentWillUnmount() {
    tracerManager.setOnError(null);
  }

  updateDirectory({ categoryKey = null, algorithmKey = null }) {
    this.props.setDirectory(categoryKey, algorithmKey);
  }

  toggleNavigator(navigatorOpened = !this.state.navigatorOpened) {
    this.setState({ navigatorOpened });
  }

  handleResizeNavigator(x, y) {
    const navigatorWidth = calculatePercentageWidth(this.elMain, x);
    this.setState({ navigatorWidth });
  }

  handleResizeViewerSection(x, y) {
    const viewerSectionWidth = calculatePercentageWidth(this.elWorkspace, x);
    this.setState({ viewerSectionWidth });
  }

  render() {
    const { navigatorOpened, navigatorWidth, viewerSectionWidth } = this.state;
    const { categories, categoryKey, algorithmKey } = this.props.env;

    return categories && categoryKey && algorithmKey && (
      <div className={styles.app}>
        <Header onClickTitleBar={() => this.toggleNavigator()} navigatorOpened={navigatorOpened} />
        <main className={styles.main} ref={ref => this.elMain = ref}>
          {
            navigatorOpened &&
            <Navigator className={styles.navigator} style={{ width: navigatorWidth }} />
          }
          <Divider vertical onResize={(x, y) => this.handleResizeNavigator(x, y)} />
          <div className={styles.workspace} ref={ref => this.elWorkspace = ref}>
            <ViewerSection className={styles.viewer_section} style={{ width: viewerSectionWidth }} />
            <Divider vertical onResize={(x, y) => this.handleResizeViewerSection(x, y)} />
            <EditorSection className={styles.editor_section} />
          </div>
        </main>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;