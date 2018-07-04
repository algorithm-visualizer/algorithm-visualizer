import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import {
  CodeEditor,
  DescriptionViewer,
  Header,
  Navigator,
  ResizableContainer,
  TabContainer,
  ToastContainer,
  WikiViewer,
} from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as envActions } from '/reducers/env';
import { GitHubApi, HierarchyApi } from '/apis';
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
  },
)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      codeFile: null,
      descFile: null,
      renderers: [],
      navigatorOpened: true,
      workspaceWeights: [1, 2, 2],
      renderersWeights: [],
      viewerTabIndex: 0,
      editorTabIndex: 0,
    };
  }

  componentDidMount() {
    this.updateDirectory(this.props.match.params);

    HierarchyApi.getHierarchy()
      .then(({ hierarchy }) => {
        this.props.setHierarchy(hierarchy);
        const { categoryKey, algorithmKey } = this.props.env;
        const category = hierarchy.find(category => category.key === categoryKey) || hierarchy[0];
        const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey) || category.algorithms[0];
        this.props.history.push(`/${category.key}/${algorithm.key}`);
      });

    const { signedIn, accessToken } = this.props.env;
    if (signedIn) GitHubApi.auth(accessToken);

    tracerManager.setOnChangeRenderers(renderers => {
      const renderersWeights = renderers.map(() => 1);
      this.setState({ renderers, renderersWeights });
    });
    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
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
      HierarchyApi.getAlgorithm(categoryKey, algorithmKey)
        .then(({ algorithm }) => {
          const { files } = algorithm;
          const codeFile = files.find(file => file.name === 'code.js') || null;
          const descFile = files.find(file => file.name === 'desc.md') || null;
          this.setState({ files, codeFile, descFile });
        })
        .catch(() => this.setState({ files: [] }));
    }
  }

  handleChangeWorkspaceWeights(workspaceWeights) {
    this.setState({ workspaceWeights });
  }

  handleChangeRenderersWeights(renderersWeights) {
    this.setState({ renderersWeights });
  }

  handleChangeViewerTabIndex(viewerTabIndex) {
    this.setState({ viewerTabIndex });
  }

  handleChangeEditorTabIndex(editorTabIndex) {
    this.setState({ editorTabIndex });
  }

  toggleNavigatorOpened(navigatorOpened = !this.state.navigatorOpened) {
    this.setState({ navigatorOpened });
  }

  render() {
    const { codeFile, descFile, renderers, navigatorOpened, workspaceWeights, renderersWeights, viewerTabIndex, editorTabIndex } = this.state;

    return (
      <div className={styles.app}>
        <Header className={styles.header} onClickTitleBar={() => this.toggleNavigatorOpened()}
                navigatorOpened={navigatorOpened} />
        <ResizableContainer className={styles.workspace} horizontal weights={workspaceWeights}
                            visibles={[navigatorOpened, true, true]}
                            onChangeWeights={weights => this.handleChangeWorkspaceWeights(weights)}>
          <Navigator />
          <TabContainer titles={['Visualization', 'Description', 'Tracer API']} tabIndex={viewerTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeViewerTabIndex(tabIndex)}>
            <ResizableContainer weights={renderersWeights} visibles={renderers.map(() => true)}
                                onChangeWeights={weights => this.handleChangeRenderersWeights(weights)}>
              {renderers}
            </ResizableContainer>
            <DescriptionViewer file={descFile} />
            <WikiViewer />
          </TabContainer>
          <TabContainer titles={['Javascript']} tabIndex={editorTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeEditorTabIndex(tabIndex)}>
            <CodeEditor file={codeFile} />
          </TabContainer>
        </ResizableContainer>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;
