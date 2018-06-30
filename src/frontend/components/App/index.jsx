import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'axios-progress-bar'
import { CodeEditor, DescriptionViewer, Header, Navigator, ToastContainer, WikiViewer, } from '/components';
import { Workspace, WSSectionContainer, WSTabContainer } from '/workspace/components';
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
  }
)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.workspaceRef = React.createRef();
    this.navigator = null;

    this.state = {
      files: [],
      codeFile: null,
      descFile: null,
      renderers: [],
    };
  }

  componentDidMount() {
    const workspace = this.workspaceRef.current;
    this.navigator = workspace.findSectionById('navigator');

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

    tracerManager.setOnRender(renderers => this.setState({ renderers }));
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

  render() {
    const { codeFile, descFile, renderers } = this.state;

    return (
      <div className={styles.app}>
        <Workspace className={styles.workspace} wsProps={{ horizontal: false }} ref={this.workspaceRef}>
          <Header wsProps={{
            removable: false,
            size: 32,
            fixed: true,
            resizable: false,
          }}
                  onClickTitleBar={() => this.navigator.setVisible(!this.navigator.visible)}
                  navigatorOpened={true /* TODO: fix */} />
          <WSSectionContainer wsProps={{ fixed: true }}>
            <Navigator wsProps={{
              id: 'navigator',
              removable: false,
              size: 240,
              minSize: 120,
              fixed: true,
            }} />
            <WSTabContainer>
              <WikiViewer wsProps={{ title: 'Tracer API' }} />
              <WSSectionContainer wsProps={{
                title: 'Visualization',
                removable: false,
                horizontal: false,
              }}>
                {renderers}
              </WSSectionContainer>
            </WSTabContainer>
            <WSTabContainer>
              <DescriptionViewer wsProps={{ title: 'Description' }} file={descFile} />
              <CodeEditor wsProps={{ title: 'code.js' }} file={codeFile} />
            </WSTabContainer>
          </WSSectionContainer>
        </Workspace>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;