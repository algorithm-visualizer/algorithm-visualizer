import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import { Divider, EditorSection, Header, Navigator, ToastContainer, ViewerSection } from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as envActions } from '/reducers/env';
import { calculatePercentageWidth } from '/common/util';
import { AlgorithmApi } from '/apis';
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
    AlgorithmApi.getCategories()
      .then(categories => {
        this.props.setCategories(categories);
        const categoryKey = Object.keys(categories)[0];
        const algorithmKey = Object.keys(categories[categoryKey].list)[0];
        this.props.selectAlgorithm(categoryKey, algorithmKey);
      });
    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
    tracerManager.setOnError(null);
  }

  componentWillReceiveProps(nextProp) {
    const { categoryKey, algorithmKey } = nextProp.env;
    if (categoryKey !== this.props.env.categoryKey || algorithmKey !== this.props.env.algorithmKey) {
      AlgorithmApi.getAlgorithm(categoryKey, algorithmKey)
        .then(algorithm => {
          this.props.setAlgorithm(algorithm);
          const fileKey = Object.keys(algorithm.files)[0];
          this.props.selectFile(categoryKey, algorithmKey, fileKey);
        });
    }
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
    const { categories, algorithm } = this.props.env;

    if (!categories || !algorithm) {
      return (
        <div className={styles.app} />
      );
    }

    return (
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