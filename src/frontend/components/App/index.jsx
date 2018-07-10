import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';
import {
  CodeEditor,
  Header,
  MarkdownViewer,
  Navigator,
  ResizableContainer,
  TabContainer,
  ToastContainer,
  VisualizationViewer,
  WikiViewer,
} from '/components';
import { CategoryApi, GitHubApi } from '/apis';
import { tracerManager } from '/core';
import { actions } from '/reducers';
import { extension } from '/common/util';
import { exts } from '/common/config';
import README from '/static/README.md';
import styles from './stylesheet.scss';

loadProgressBar();

@connect(({ current, env }) => ({ current, env }), actions)
class App extends React.Component {
  constructor(props) {
    super(props);

    const { signedIn, accessToken } = this.props.env;
    if (signedIn) GitHubApi.auth(accessToken);

    this.state = {
      navigatorOpened: true,
      workspaceWeights: [1, 2, 2],
      viewerTabIndex: 0,
      editingFileName: undefined,
    };
  }

  componentDidMount() {
    this.loadAlgorithm(this.props.match.params);

    CategoryApi.getCategories()
      .then(({ categories }) => this.props.setCategories(categories));

    const { signedIn } = this.props.env;
    if (signedIn) this.loadScratchPapers();

    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
    tracerManager.setOnRun(null);
    tracerManager.setOnError(null);
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.match;
    const { categoryKey, algorithmKey, gistId } = nextProps.current;
    if (params.categoryKey !== categoryKey ||
      params.algorithmKey !== algorithmKey ||
      params.gistId !== gistId) {
      if (nextProps.location.pathname !== this.props.location.pathname) {
        this.loadAlgorithm(params);
      } else {
        if (categoryKey && algorithmKey) {
          this.props.history.push(`/${categoryKey}/${algorithmKey}`);
        } else if (gistId) {
          this.props.history.push(`/scratch-paper/${gistId}`);
        } else {
          this.props.history.push('/');
        }
      }
    }
  }

  loadScratchPapers() {
    const per_page = 100;
    const paginateGists = (page = 1, scratchPapers = []) => GitHubApi.listGists({
      per_page,
      page,
      timestamp: Date.now(),
    }).then(gists => {
      scratchPapers.push(...gists.filter(gist => 'algorithm-visualizer' in gist.files).map(gist => ({
        key: gist.id,
        name: gist.description,
        files: Object.keys(gist.files),
      })));
      if (gists.length < per_page) {
        return scratchPapers;
      } else {
        return paginateGists(page + 1, scratchPapers);
      }
    });
    return paginateGists().then(scratchPapers => this.props.setScratchPapers(scratchPapers));
  }

  loadAlgorithm({ categoryKey, algorithmKey, gistId }) {
    const { ext } = this.props.env;
    let fetchPromise = Promise.reject();
    if (categoryKey && algorithmKey) {
      fetchPromise = CategoryApi.getAlgorithm(categoryKey, algorithmKey)
        .then(({ algorithm }) => algorithm);
    } else if (gistId === 'new') {
      fetchPromise = Promise.resolve({
        titles: ['Scratch Paper', 'Untitled'],
        files: [{
          name: 'README.md',
          content: '# README',
          contributors: [],
        }, {
          name: `code.${ext}`,
          content: '',
          contributors: [],
        }],
      });
    } else if (gistId) {
      fetchPromise = GitHubApi.getGist(gistId, { timestamp: Date.now() }).then(gist => {
        const titles = ['Scratch Paper', gist.description];
        delete gist.files['algorithm-visualizer'];
        const files = Object.values(gist.files).map(file => ({
          name: file.filename,
          content: file.content,
          contributors: [gist.owner],
        }));
        return { titles, files };
      });
    }
    fetchPromise
      .then(algorithm => this.props.setCurrent(categoryKey, algorithmKey, gistId, algorithm.titles, algorithm.files))
      .catch(() => this.props.setCurrent(undefined, undefined, undefined, ['Algorithm Visualizer'], [{
        name: 'README.md',
        content: README,
        contributors: [{
          avatar_url: 'https://github.com/algorithm-visualizer.png',
          login: 'algorithm-visualizer',
        }],
      }]))
      .finally(() => {
        const { files } = this.props.current;
        const editingFile = files.find(file => extension(file.name) === ext) || files.find(file => exts.includes(extension(file.name))) || files[0];
        this.handleChangeEditingFileName(editingFile.name);
      });
  }

  handleChangeWorkspaceWeights(workspaceWeights) {
    this.setState({ workspaceWeights });
  }

  handleChangeViewerTabIndex(viewerTabIndex) {
    this.setState({ viewerTabIndex });
  }

  handleChangeEditorTabIndex(editorTabIndex) {
    const { files } = this.props.current;
    if (editorTabIndex === files.length) {
      let newFileName = 'untitled';
      let count = 0;
      while (files.some(file => file.name === newFileName)) newFileName = `untitled-${++count}`;
      this.props.addFile({
        name: newFileName,
        content: '',
        contributors: [],
      });
      this.handleChangeEditingFileName(newFileName);
    } else {
      const editingFileName = files[editorTabIndex].name;
      this.handleChangeEditingFileName(editingFileName);
    }
  }

  handleChangeEditingFileName(editingFileName) {
    this.setState({ editingFileName });
  }

  toggleNavigatorOpened(navigatorOpened = !this.state.navigatorOpened) {
    this.setState({ navigatorOpened });
  }

  render() {
    const { navigatorOpened, workspaceWeights, viewerTabIndex, editingFileName } = this.state;
    const { files } = this.props.current;

    const readmeFile = files.find(file => file.name === 'README.md');
    const editorTabIndex = files.findIndex(file => file.name === editingFileName);

    return (
      <div className={styles.app}>
        <Header className={styles.header} onClickTitleBar={() => this.toggleNavigatorOpened()}
                navigatorOpened={navigatorOpened} loadScratchPapers={() => this.loadScratchPapers()}
                loadAlgorithm={params => this.loadAlgorithm(params)}
                onAction={() => this.handleChangeViewerTabIndex(1)} />
        <ResizableContainer className={styles.workspace} horizontal weights={workspaceWeights}
                            visibles={[navigatorOpened, true, true]}
                            onChangeWeights={weights => this.handleChangeWorkspaceWeights(weights)}>
          <Navigator loadAlgorithm={params => this.loadAlgorithm(params)} />
          <TabContainer titles={['Description', 'Visualization', 'Tracer API']} tabIndex={viewerTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeViewerTabIndex(tabIndex)}>
            <MarkdownViewer source={readmeFile ? readmeFile.content : 'README.md not found'} />
            <VisualizationViewer />
            <WikiViewer />
          </TabContainer>
          <TabContainer titles={[...files.map(file => file.name), <FontAwesomeIcon fixedWidth icon={faPlus} />]}
                        tabIndex={editorTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeEditorTabIndex(tabIndex)}>
            {
              files.map(file => (
                <CodeEditor key={file.name} file={file} />
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
