import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import AutosizeInput from 'react-input-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '/components';
import { CategoryApi, GitHubApi } from '/apis';
import { tracerManager } from '/core';
import { actions } from '/reducers';
import { extension, refineGist } from '/common/util';
import { exts } from '/common/config';
import README from '/static/README.md';
import styles from './stylesheet.scss';

loadProgressBar();

@connect(({ current, env }) => ({ current, env }), actions)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigatorOpened: true,
      workspaceWeights: [1, 2, 2],
      viewerTabIndex: 0,
      editorTabIndex: -1,
    };
  }

  componentDidMount() {
    this.loadAlgorithm(this.props.match.params);

    const { accessToken } = this.props.env;
    if (accessToken) {
      GitHubApi.auth(accessToken)
        .then(() => GitHubApi.getUser())
        .then(user => {
          const { login, avatar_url } = user;
          this.props.setUser({ login, avatar_url });
        })
        .then(() => this.loadScratchPapers());
    }

    CategoryApi.getCategories()
      .then(({ categories }) => this.props.setCategories(categories));

    tracerManager.setOnError(error => this.props.showErrorToast(error.message));
  }

  componentWillUnmount() {
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
      fetchPromise = GitHubApi.getGist(gistId, { timestamp: Date.now() }).then(refineGist);
    }
    fetchPromise
      .then(algorithm => this.props.setCurrent(categoryKey, algorithmKey, gistId, algorithm.titles, algorithm.files))
      .catch(() => this.props.setCurrent(undefined, undefined, undefined, ['Algorithm Visualizer'], [{
        name: 'README.md',
        content: README,
        contributors: [{
          login: 'algorithm-visualizer',
          avatar_url: 'https://github.com/algorithm-visualizer.png',
        }],
      }]))
      .finally(() => {
        const { files } = this.props.current;
        let editorTabIndex = files.findIndex(file => extension(file.name) === ext);
        if (!~editorTabIndex) editorTabIndex = files.findIndex(file => exts.includes(extension(file.name)));
        if (!~editorTabIndex) editorTabIndex = Math.min(0, files.length - 1);
        this.handleChangeEditorTabIndex(editorTabIndex);
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
    if (editorTabIndex === files.length) this.handleAddFile();
    this.setState({ editorTabIndex });
  }

  handleAddFile() {
    const { files } = this.props.current;
    let name = 'untitled';
    let count = 0;
    while (files.some(file => file.name === name)) name = `untitled-${++count}`;
    this.props.addFile({
      name,
      content: '',
      contributors: [],
    });
  }

  handleRenameFile(e) {
    const { value } = e.target;
    const { editorTabIndex } = this.state;
    this.props.renameFile(editorTabIndex, value);
  }

  handleDeleteFile(file) {
    const { files } = this.props.current;
    const { editorTabIndex } = this.state;
    if (files.indexOf(file) < editorTabIndex) this.handleChangeEditorTabIndex(editorTabIndex - 1);
    else this.handleChangeEditorTabIndex(Math.min(editorTabIndex, files.length - 2));
    this.props.deleteFile(file);
  }

  toggleNavigatorOpened(navigatorOpened = !this.state.navigatorOpened) {
    this.setState({ navigatorOpened });
  }

  render() {
    const { navigatorOpened, workspaceWeights, viewerTabIndex, editorTabIndex } = this.state;
    const { titles, files } = this.props.current;

    const readmeFile = files.find(file => file.name === 'README.md');

    const editorTitles = files.map(file => file.name);
    if (files[editorTabIndex]) {
      editorTitles[editorTabIndex] = (
        <AutosizeInput className={styles.input_title} value={files[editorTabIndex].name}
                       onClick={e => e.stopPropagation()} onChange={e => this.handleRenameFile(e)} />
      );
    }
    editorTitles.push(
      <FontAwesomeIcon fixedWidth icon={faPlus} />,
    );

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
          <TabContainer titles={['Description', 'Visualization']} tabIndex={viewerTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeViewerTabIndex(tabIndex)}>
            <MarkdownViewer source={readmeFile ? readmeFile.content : 'README.md not found'} />
            <VisualizationViewer />
          </TabContainer>
          <TabContainer className={styles.editor_tab_container} titles={editorTitles} tabIndex={editorTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeEditorTabIndex(tabIndex)}>
            {
              files.map((file, i) => (
                <CodeEditor key={[...titles, i].join('--')} file={file}
                            onDeleteFile={file => this.handleDeleteFile(file)} />
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
