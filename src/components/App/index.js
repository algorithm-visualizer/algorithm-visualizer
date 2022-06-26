import React from "react";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import {
  BaseComponent,
  CodeEditor,
  Header,
  Navigator,
  ResizableContainer,
  TabContainer,
  ToastContainer,
  VisualizationViewer,
} from "components";
import { AlgorithmApi, GitHubApi, VisualizationApi } from "apis";
import { actions } from "reducers";
import { createUserFile, extension, refineGist } from "common/util";
import { CODE_JS } from "files";
import { SCRATCH_PAPER_README_MD } from "files";
import styles from "./App.module.scss";

class App extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      workspaceVisibles: [true, true, true],
      workspaceWeights: [1, 2, 2],
    };

    this.codeEditorRef = React.createRef();

    this.ignoreHistoryBlock = this.ignoreHistoryBlock.bind(this);
    this.handleClickTitleBar = this.handleClickTitleBar.bind(this);
    this.loadScratchPapers = this.loadScratchPapers.bind(this);
    this.handleChangeWorkspaceWeights =
      this.handleChangeWorkspaceWeights.bind(this);
  }

  componentDidMount() {
    window.signIn = this.signIn.bind(this);
    window.signOut = this.signOut.bind(this);

    const accessToken = Cookies.get("access_token");
    if (accessToken) this.signIn(accessToken);

    const categories = [];

    const paths = require.context("/public/algorithms?inline", true).keys();
    paths
      .filter((path) => path.endsWith(".js") || path.endsWith(".md"))
      .forEach((path) => {
        const parts = path.split("/");
        let category = categories.find((category) => category.key === parts[1]);
        if (!category) {
          category = { key: parts[1], name: parts[1], algorithms: [] };
          categories.push(category);
        }
        const alg = category.algorithms.find((alg) => alg.key === parts[2]);
        if (!alg) {
          category.algorithms.push({
            key: parts[2],
            name: parts[2],
            files: [parts[3]],
          });
        } else {
          alg.files.push(parts[3]);
        }
      });

    this.props.setCategories(categories);

    const { params } = this.props.match;
    const { search } = this.props.location;

    let files = null;

    const category = categories.find(
      (category) => category.key === params.categoryKey
    );

    if (category) {
      const alg = category.algorithms.find(
        (alg) => alg.key === params.algorithmKey
      );
      if (alg) {
        files = alg.files;
      }
    }

    this.loadAlgorithm(
      {
        files: files ? files : [],
        categoryKey: params.categoryKey,
        algorithmKey: params.algorithmKey,
        gistId: params.gistId,
      },
      queryString.parse(search)
    );

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
    const { categories } = nextProps.directory;

    if (
      params !== this.props.match.params ||
      search !== this.props.location.search
    ) {
      const { categoryKey, algorithmKey, gistId } = params;
      const { algorithm, scratchPaper } = nextProps.current;
      if (
        algorithm &&
        algorithm.categoryKey === categoryKey &&
        algorithm.algorithmKey === algorithmKey
      ) {
        return;
      }
      if (scratchPaper && scratchPaper.gistId === gistId) return;
      let files = [];
      if (categories && params.categoryKey && params.algorithmKey) {
        files = categories
          .find((category) => category.key === params.categoryKey)
          .algorithms.find((alg) => alg.key === params.algorithmKey).files;
      }
      this.loadAlgorithm(
        {
          files: files,
          categoryKey: params.categoryKey,
          algorithmKey: params.algorithmKey,
          gistId: params.gistId,
        },
        queryString.parse(search)
      );
    }
  }

  toggleHistoryBlock(enable = !this.unblock) {
    if (enable) {
      const warningMessage = "Are you sure you want to discard changes?";
      window.onbeforeunload = () => {
        const { saved } = this.props.current;
        if (!saved) return warningMessage;
      };
      this.unblock = this.props.history.block((location) => {
        if (location.pathname === this.props.location.pathname) return;
        const { saved } = this.props.current;
        if (!saved) return warningMessage;
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
    Cookies.set("access_token", accessToken);
    GitHubApi.auth(accessToken)
      .then(() => GitHubApi.getUser())
      .then((user) => {
        const { login, avatar_url } = user;
        this.props.setUser({ login, avatar_url });
      })
      .then(() => this.loadScratchPapers())
      .catch(() => this.signOut());
  }

  signOut() {
    Cookies.remove("access_token");
    GitHubApi.auth(undefined)
      .then(() => {
        this.props.setUser(undefined);
      })
      .then(() => this.props.setScratchPapers([]));
  }

  loadScratchPapers() {
    const per_page = 100;
    const paginateGists = (page = 1, scratchPapers = []) =>
      GitHubApi.listGists({
        per_page,
        page,
        timestamp: Date.now(),
      }).then((gists) => {
        scratchPapers.push(
          ...gists
            .filter((gist) => "algorithm-visualizer" in gist.files)
            .map((gist) => ({
              key: gist.id,
              name: gist.description,
              files: Object.keys(gist.files),
            }))
        );
        if (gists.length < per_page) {
          return scratchPapers;
        } else {
          return paginateGists(page + 1, scratchPapers);
        }
      });
    return paginateGists()
      .then((scratchPapers) => this.props.setScratchPapers(scratchPapers))
      .catch(this.handleError);
  }

  loadAlgorithm(
    { categoryKey, algorithmKey, files, gistId },
    { visualizationId }
  ) {
    const fetch = () => {
      if (categoryKey && algorithmKey) {
        return AlgorithmApi.getAlgorithm(categoryKey, algorithmKey, files).then(
          ({ algorithm }) => this.props.setAlgorithm(algorithm)
        );
      } else if (gistId === "new" && visualizationId) {
        return VisualizationApi.getVisualization(visualizationId).then(
          (content) => {
            this.props.setScratchPaper({
              login: undefined,
              gistId,
              title: "Untitled",
              files: [
                SCRATCH_PAPER_README_MD,
                createUserFile("visualization.json", JSON.stringify(content)),
              ],
            });
          }
        );
      } else if (gistId === "new") {
        this.props.setScratchPaper({
          login: undefined,
          gistId,
          title: "Untitled",
          files: [SCRATCH_PAPER_README_MD, CODE_JS],
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
      .then(() => {
        this.selectDefaultTab();
      })
      .catch((error) => {
        this.handleError(error);
        this.props.history.push("/");
      });
  }

  selectDefaultTab() {
    const { files } = this.props.current;
    const editingFile =
      files.find((file) => extension(file.name) === "js") ||
      files.find((file) => extension(file.name) === "md") ||
      files[files.length - 1];
    this.props.setEditingFile(editingFile);
  }

  handleChangeWorkspaceWeights(workspaceWeights) {
    this.setState({ workspaceWeights });
    this.codeEditorRef.current.handleResize();
  }

  toggleNavigatorOpened(navigatorOpened = !this.state.workspaceVisibles[0]) {
    const workspaceVisibles = [...this.state.workspaceVisibles];
    workspaceVisibles[0] = navigatorOpened;
    this.setState({ workspaceVisibles });
  }

  handleClickTitleBar() {
    this.toggleNavigatorOpened();
  }

  render() {
    const { workspaceVisibles, workspaceWeights } = this.state;
    const { titles, description, saved } = this.props.current;

    const title = `${saved ? "" : "(Unsaved) "}${titles.join(" - ")}`;
    const [navigatorOpened] = workspaceVisibles;

    return (
      <div className={styles.app}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Header
          className={styles.header}
          onClickTitleBar={this.handleClickTitleBar}
          navigatorOpened={navigatorOpened}
          loadScratchPapers={this.loadScratchPapers}
          ignoreHistoryBlock={this.ignoreHistoryBlock}
        />
        <ResizableContainer
          className={styles.workspace}
          horizontal
          weights={workspaceWeights}
          visibles={workspaceVisibles}
          onChangeWeights={this.handleChangeWorkspaceWeights}
        >
          <Navigator />
          <VisualizationViewer className={styles.visualization_viewer} />
          <TabContainer className={styles.editor_tab_container}>
            <CodeEditor ref={this.codeEditorRef} />
          </TabContainer>
        </ResizableContainer>
        <ToastContainer className={styles.toast_container} />
      </div>
    );
  }
}

export default connect(
  ({ current, env, directory }) => ({ current, env, directory }),
  actions
)(App);
