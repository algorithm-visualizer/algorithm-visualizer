import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import { loadProgressBar } from 'axios-progress-bar'
import {
  CodeEditor,
  DescriptionViewer,
  Header,
  Navigator,
  ResizableContainer,
  TabContainer,
  ToastContainer,
  VisualizationViewer,
  WikiViewer,
} from '/components';
import { actions as toastActions } from '/reducers/toast';
import { actions as directoryActions } from '/reducers/directory';
import { CategoryApi, GitHubApi } from '/apis';
import { tracerManager } from '/core';
import { exts } from '/common/config';
import README from '/static/README.md';
import 'axios-progress-bar/dist/nprogress.css';
import styles from './stylesheet.scss';

loadProgressBar();

@connect(
  ({ directory, env, toast }) => ({
    directory, env, toast,
  }), {
    ...toastActions,
    ...directoryActions,
  },
)
class App extends React.Component {
  constructor(props) {
    super(props);

    const { signedIn, accessToken } = this.props.env;
    if (signedIn) GitHubApi.auth(accessToken);

    this.state = {
      navigatorOpened: true,
      workspaceWeights: [1, 2, 2],
      viewerTabIndex: 0,
      editorTabIndex: 0,
    };
  }

  componentDidMount() {
    this.updateDirectory(this.props.match.params);

    CategoryApi.getCategories()
      .then(({ categories }) => this.props.setCategories(categories));

    const { signedIn } = this.props.env;
    if (signedIn) {
      const per_page = 100;
      const paginateGists = (page = 1, prevScratchPapers = []) => GitHubApi.listGists({
        per_page,
        page,
      }).then(gists => {
        const scratchPapers = [...prevScratchPapers, ...gists.filter(gist => 'algorithm-visualizer' in gist.files).map(gist => ({
          key: gist.id,
          name: gist.description,
          files: Object.keys(gist.files),
        }))];
        if (gists.length < per_page) {
          return scratchPapers;
        } else {
          return paginateGists(page + 1, scratchPapers);
        }
      });
      paginateGists().then(scratchPapers => {
        this.props.setScratchPapers(scratchPapers);
      });
    }

    tracerManager.setOnRun(() => this.handleChangeViewerTabIndex(1));
    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
    tracerManager.setOnRun(null);
    tracerManager.setOnError(null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      this.updateDirectory(nextProps.match.params);
    }
  }

  updateDirectory({ categoryKey, algorithmKey, gistId }) {
    let fetchPromise = new Promise((resolve, reject) => reject());
    if (categoryKey && algorithmKey) {
      fetchPromise = CategoryApi.getAlgorithm(categoryKey, algorithmKey)
        .then(({ algorithm }) => algorithm);
    } else if (gistId) {
      fetchPromise = GitHubApi.getGist(gistId)
        .then(gist => {
          const key = gistId;
          const name = gist.description;
          const files = Object.values(gist.files).map(file => ({
            name: file.filename,
            content: file.content,
            contributors: [gist.owner],
          }));
          const titles = ['Scratch Paper', name];
          return { key, name, files, titles };
        });
    }
    fetchPromise.then(algorithm => {
      const descFile = algorithm.files.find(file => file.name === 'desc.md') || {
        name: 'desc.md',
        content: 'Description file not found',
        contributors: [{
          avatar_url: 'https://github.com/algorithm-visualizer.png',
          login: 'algorithm-visualizer',
        }],
      };
      const codeFiles = exts.map(ext => algorithm.files.find(file => file.name === `code.${ext}`)).filter(v => v);
      this.props.setCurrent(categoryKey, algorithmKey, gistId, algorithm.titles, descFile, codeFiles);
      const { ext } = this.props.env;
      const editorTabIndex = codeFiles.findIndex(file => file.name === `code.${ext}`);
      this.handleChangeEditorTabIndex(~editorTabIndex ? editorTabIndex : 0);
    }).catch(() => {
      const titles = ['Algorithm Visualizer'];
      const descFile = {
        name: 'README.md',
        content: README,
        contributors: [{
          avatar_url: 'https://github.com/algorithm-visualizer.png',
          login: 'algorithm-visualizer',
        }],
      };
      const codeFiles = [];
      this.props.setCurrent(categoryKey, algorithmKey, gistId, titles, descFile, codeFiles);
    });
  }

  handleChangeWorkspaceWeights(workspaceWeights) {
    this.setState({ workspaceWeights });
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
    const { navigatorOpened, workspaceWeights, viewerTabIndex, editorTabIndex } = this.state;
    const { current } = this.props.directory;

    return (
      <div className={styles.app}>
        <Header className={styles.header} onClickTitleBar={() => this.toggleNavigatorOpened()}
                navigatorOpened={navigatorOpened} />
        <ResizableContainer className={styles.workspace} horizontal weights={workspaceWeights}
                            visibles={[navigatorOpened, true, true]}
                            onChangeWeights={weights => this.handleChangeWorkspaceWeights(weights)}>
          <Navigator />
          <TabContainer titles={['Description', 'Visualization', 'Tracer API']} tabIndex={viewerTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeViewerTabIndex(tabIndex)}>
            <DescriptionViewer file={current.descFile} />
            <VisualizationViewer />
            <WikiViewer />
          </TabContainer>
          <TabContainer titles={current.codeFiles.map(file => file.name)} tabIndex={editorTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeEditorTabIndex(tabIndex)}>
            {
              current.codeFiles.map(codeFile => (
                <CodeEditor key={codeFile.name} file={codeFile} />
              ))
            }
          </TabContainer>
        </ResizableContainer>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;
