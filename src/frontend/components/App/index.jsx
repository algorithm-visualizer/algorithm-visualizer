import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import {
  CodeEditor,
  DescriptionViewer,
  Header,
  Navigator,
  RendererContainer,
  ToastContainer,
  WikiViewer
} from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as envActions } from '/reducers/env';
import { DirectoryApi } from '/apis';
import { tracerManager, Workspace } from '/core';
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

    this.workspace = new Workspace();
    this.navigator = this.workspace.addBasicSection(Navigator, 2);
    const leftTabSection = this.workspace.addTabSection(5);
    leftTabSection.addTab('Visualization', RendererContainer);
    leftTabSection.addTab('Description', DescriptionViewer);
    leftTabSection.addTab('Tracer API', WikiViewer);
    const rightTabSection = this.workspace.addTabSection(5);
    rightTabSection.addTab('code.js', CodeEditor);
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
    this.workspace.setOnChange(() => this.forceUpdate());
  }

  componentWillUnmount() {
    tracerManager.setOnError(null);
    this.workspace.setOnChange(null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      this.updateDirectory(nextProps.match.params);
    }
  }

  updateDirectory({ categoryKey = null, algorithmKey = null }) {
    this.props.setDirectory(categoryKey, algorithmKey);
  }

  render() {
    const { categories, categoryKey, algorithmKey } = this.props.env;

    const navigatorOpened = this.navigator.isVisible();

    return categories && categoryKey && algorithmKey && (
      <div className={styles.app}>
        <Header onClickTitleBar={() => this.navigator.setVisible(!navigatorOpened)} navigatorOpened={navigatorOpened} />
        {
          this.workspace.render({ className: styles.workspace })
        }
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;