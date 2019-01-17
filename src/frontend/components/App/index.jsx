import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import { Helmet } from 'react-helmet';
import AutosizeInput from 'react-input-autosize';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import {
  BaseComponent,
  CodeEditor,
  Header,
  Navigator,
  ResizableContainer,
  TabContainer,
  ToastContainer,
  VisualizationViewer,
} from '/components';
import { AlgorithmApi, GitHubApi, VisualizationApi } from '/apis';
import { actions } from '/reducers';
import { createUserFile, extension, refineGist } from '/common/util';
import { exts, languages } from '/common/config';
import { CONTRIBUTING_MD } from '/files';
import styles from './stylesheet.scss';

@connect(({ current, env }) => ({ current, env }), actions)
class App extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      navigatorOpened: true,
      workspaceWeights: [1, 2, 2],
      editorTabIndex: -1,
    };

    this.codeEditorRef = React.createRef();

    this.ignoreHistoryBlock = this.ignoreHistoryBlock.bind(this);
  }

  componentDidMount() {
    window.signIn = this.signIn.bind(this);
    window.signOut = this.signOut.bind(this);

    const { params } = this.props.match;
    const { search } = this.props.location;
    this.loadAlgorithm(params, queryString.parse(search));

    const accessToken = Cookies.get('access_token');
    if (accessToken) this.signIn(accessToken);

    AlgorithmApi.getCategories()
      .then(({ categories }) => this.props.setCategories(categories))
      .catch(this.handleError);

    this.toggleHistoryBlock(true);
  }

  componentWillUnmount() {
    delete window.signIn;
    delete window.signOut;

    this.toggleHistoryBlock(false);
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.match;
    const { search } = nextProps.location;
    if (params !== this.props.match.params || search !== this.props.location.search) {
      const { categoryKey, algorithmKey, gistId } = params;
      const { algorithm, scratchPaper } = nextProps.current;
      if (algorithm && algorithm.categoryKey === categoryKey && algorithm.algorithmKey === algorithmKey) return;
      if (scratchPaper && scratchPaper.gistId === gistId) return;
      this.loadAlgorithm(params, queryString.parse(search));
    }
  }

  toggleHistoryBlock(enable = !this.unblock) {
    if (enable) {
      const warningMessage = 'Are you sure you want to discard changes?';
      window.onbeforeunload = () => this.isSaved() ? undefined : warningMessage;
      this.unblock = this.props.history.block((location) => {
        if (location.pathname === this.props.location.pathname) return;
        if (!this.isSaved()) return warningMessage;
      });
    } else {
      window.onbeforeunload = undefined;
      this.unblock();
      this.unblock = undefined;
    }
  }

  ignoreHistoryBlock(process) {
    this.toggleHistoryBlock(false);
    process();
    this.toggleHistoryBlock(true);
  }

  signIn(accessToken) {
    Cookies.set('access_token', accessToken);
    GitHubApi.auth(accessToken)
      .then(() => GitHubApi.getUser())
      .then(user => {
        const { login, avatar_url } = user;
        this.props.setUser({ login, avatar_url });
      })
      .then(() => this.loadScratchPapers())
      .catch(() => this.signOut());
  }

  signOut() {
    Cookies.remove('access_token');
    GitHubApi.auth(undefined)
      .then(() => {
        this.props.setUser(undefined);
      })
      .then(() => this.props.setScratchPapers([]));
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
    return paginateGists()
      .then(scratchPapers => this.props.setScratchPapers(scratchPapers))
      .catch(this.handleError);
  }

  loadAlgorithm({ categoryKey, algorithmKey, gistId }, { visualizationId }) {
    const { ext } = this.props.env;
    const fetch = () => {
      if (window.__PRELOADED_ALGORITHM__) {
        this.props.setAlgorithm(window.__PRELOADED_ALGORITHM__);
        delete window.__PRELOADED_ALGORITHM__;
      } else if (categoryKey && algorithmKey) {
        return AlgorithmApi.getAlgorithm(categoryKey, algorithmKey)
          .then(({ algorithm }) => this.props.setAlgorithm(algorithm));
      } else if (gistId === 'new' && visualizationId) {
        return VisualizationApi.getVisualization(visualizationId)
          .then(content => {
            this.props.setScratchPaper({
              login: undefined,
              gistId,
              title: 'Untitled',
              files: [CONTRIBUTING_MD, createUserFile('traces.json', JSON.stringify(content))],
            });
          });
      } else if (gistId === 'new') {
        const language = languages.find(language => language.ext === ext);
        this.props.setScratchPaper({
          login: undefined,
          gistId,
          title: 'Untitled',
          files: [CONTRIBUTING_MD, language.skeleton],
        });
      } else if (gistId) {
        return GitHubApi.getGist(gistId, { timestamp: Date.now() })
          .then(refineGist)
          .then(this.props.setScratchPaper);
      } else {
        this.props.setHome();
      }
      return Promise.resolve();
    };
    fetch()
      .then(() => this.selectDefaultTab())
      .catch(error => {
        this.handleError(error);
        this.props.history.push('/');
      });
  }

  selectDefaultTab() {
    const { ext } = this.props.env;
    const { files } = this.props.current;
    let editorTabIndex = files.findIndex(file => extension(file.name) === 'json');
    if (!~editorTabIndex) files.findIndex(file => extension(file.name) === ext);
    if (!~editorTabIndex) editorTabIndex = files.findIndex(file => exts.includes(extension(file.name)));
    if (!~editorTabIndex) editorTabIndex = Math.min(0, files.length - 1);
    this.handleChangeEditorTabIndex(editorTabIndex);
  }

  handleChangeWorkspaceWeights(workspaceWeights) {
    this.setState({ workspaceWeights });
    this.codeEditorRef.current.getWrappedInstance().handleResize();
  }

  handleChangeEditorTabIndex(editorTabIndex) {
    const { files } = this.props.current;
    if (editorTabIndex === files.length) this.handleAddFile();
    this.setState({ editorTabIndex });
    this.props.shouldBuild();
  }

  handleAddFile() {
    const { ext } = this.props.env;
    const { files } = this.props.current;
    const language = languages.find(language => language.ext === ext);
    const file = { ...language.skeleton };
    let count = 0;
    while (files.some(existingFile => existingFile.name === file.name)) file.name = `code-${++count}.${ext}`;
    this.props.addFile(file);
  }

  handleRenameFile(e) {
    const { value } = e.target;
    const { editorTabIndex } = this.state;
    this.props.renameFile(editorTabIndex, value);
  }

  handleDeleteFile() {
    const { editorTabIndex } = this.state;
    const { files } = this.props.current;
    this.handleChangeEditorTabIndex(Math.min(editorTabIndex, files.length - 2));
    this.props.deleteFile(editorTabIndex);
  }

  toggleNavigatorOpened(navigatorOpened = !this.state.navigatorOpened) {
    this.setState({ navigatorOpened });
  }

  isSaved() {
    const { titles, files, lastTitles, lastFiles } = this.props.current;
    const serialize = (titles, files) => JSON.stringify({
      titles,
      files: files.map(({ name, content }) => ({ name, content })),
    });
    return serialize(titles, files) === serialize(lastTitles, lastFiles);
  }

  render() {
    const { navigatorOpened, workspaceWeights, editorTabIndex } = this.state;

    const { files, titles, description } = this.props.current;
    const saved = this.isSaved();
    const title = `${saved ? '' : '(Unsaved) '}${titles.join(' - ')}`;
    const file = files[editorTabIndex];

    const editorTitles = files.map(file => file.name);
    if (file) {
      editorTitles[editorTabIndex] = (
        <AutosizeInput className={styles.input_title} value={file.name}
                       onClick={e => e.stopPropagation()} onChange={e => this.handleRenameFile(e)} />
      );
    }
    editorTitles.push(
      <FontAwesomeIcon fixedWidth icon={faPlus} />,
    );

    return (
      <div className={styles.app}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Header className={styles.header} onClickTitleBar={() => this.toggleNavigatorOpened()} saved={saved}
                navigatorOpened={navigatorOpened} loadScratchPapers={() => this.loadScratchPapers()} file={file}
                ignoreHistoryBlock={this.ignoreHistoryBlock} />
        <ResizableContainer className={styles.workspace} horizontal weights={workspaceWeights}
                            visibles={[navigatorOpened, true, true]}
                            onChangeWeights={weights => this.handleChangeWorkspaceWeights(weights)}>
          <Navigator />
          <VisualizationViewer className={styles.visualization_viewer} />
          <TabContainer className={styles.editor_tab_container} titles={editorTitles} tabIndex={editorTabIndex}
                        onChangeTabIndex={tabIndex => this.handleChangeEditorTabIndex(tabIndex)}>
            <CodeEditor ref={this.codeEditorRef} file={file} onClickDelete={() => this.handleDeleteFile()} />
          </TabContainer>
        </ResizableContainer>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default App;
