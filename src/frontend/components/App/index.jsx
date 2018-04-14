import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import { CodeEditor, DescriptionViewer, Header, Navigator, ToastContainer, WikiViewer } from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as envActions } from '/reducers/env';
import { DirectoryApi } from '/apis';
import { tracerManager, workspace } from '/core';
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

    this.navigator = workspace.addBasicSection(Navigator, { weight: 2, removable: false });
    this.leftContainer = workspace.addContainer({ horizontal: false, weight: 5, removable: false });
    this.rightTabSection = workspace.addTabSection({ weight: 5, removable: false });
    this.rightTabSection.addTab('Description', DescriptionViewer);
    this.rightTabSection.addTab('Tracer API', WikiViewer);
    this.rightTabSection.addTab('code.js', CodeEditor);
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

    workspace.setOnChange(() => this.forceUpdate());
    tracerManager.setOnRender(renderers => this.handleChangeRenderers(renderers));
    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
    workspace.setOnChange(null);
    tracerManager.setOnRender(null);
    tracerManager.setOnError(null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      this.updateDirectory(nextProps.match.params);
    }
  }

  updateDirectory({ categoryKey = null, algorithmKey = null }) {
    if (categoryKey && algorithmKey) {
      this.props.setDirectory(categoryKey, algorithmKey);
      DirectoryApi.getFile(categoryKey, algorithmKey, 'code.js').then(code => tracerManager.setCode(code));
    }
  }

  handleChangeRenderers(renderers) {
    workspace.disableChange();
    const oldTabs = this.rendererTabs || {};
    const newTabs = {};
    for (const renderer of renderers) {
      const { title, tracerKey, Component } = renderer;
      let tab = null;
      if (tracerKey in oldTabs) {
        tab = oldTabs[tracerKey];
        tab.setTitle(title);
        tab.setComponent(Component);
        delete oldTabs[tracerKey];
      } else {
        tab = this.leftContainer.addTabSection().addTab(title, Component);
      }
      newTabs[tracerKey] = tab;
    }
    Object.values(oldTabs).forEach(tab => tab.remove());
    this.rendererTabs = newTabs;
    workspace.enableChange();
    workspace.change();
  }

  render() {
    const { categories, categoryKey, algorithmKey } = this.props.env;

    const navigatorOpened = this.navigator.isVisible();

    return categories && categoryKey && algorithmKey && (
      <div className={styles.app}>
        <Header onClickTitleBar={() => this.navigator.setVisible(!navigatorOpened)} navigatorOpened={navigatorOpened} />
        {
          workspace.render({ className: styles.workspace })
        }
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;