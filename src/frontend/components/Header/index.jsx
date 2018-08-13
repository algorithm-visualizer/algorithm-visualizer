import React from 'react';
import { connect } from 'react-redux';
import AutosizeInput from 'react-input-autosize';
import screenfull from 'screenfull';
import Promise from 'bluebird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import faExpandArrowsAlt from '@fortawesome/fontawesome-free-solid/faExpandArrowsAlt';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import { GitHubApi } from '/apis';
import { classes, handleError, refineGist } from '/common/util';
import { actions } from '/reducers';
import { languages } from '/common/config';
import { Button, Ellipsis, ListItem, Player } from '/components';
import styles from './stylesheet.scss';
import { getTitleArray } from '../../common/util';

@connect(({ current, env }) => ({ current, env }), actions)
class Header extends React.Component {
  handleClickFullScreen() {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  }

  handleChangeTitle(e) {
    const { value } = e.target;
    this.props.modifyTitle(value);
  }

  saveGist() {
    const { user } = this.props.env;
    const { scratchPaper } = this.props.current;
    const { gistId, title, files, lastFiles, lastGist } = scratchPaper;
    const gist = {
      description: title,
      files: {},
    };
    files.forEach(file => {
      gist.files[file.name] = {
        content: file.content,
      };
    });
    lastFiles.forEach(lastFile => {
      if (!(lastFile.name in gist.files)) {
        gist.files[lastFile.name] = null;
      }
    });
    gist.files['algorithm-visualizer'] = {
      content: 'https://algorithm-visualizer.org/',
    };
    const save = gist => {
      if (!user) return Promise.reject(new Error('Sign In Required'));
      if (gistId === 'new') return GitHubApi.createGist(gist);
      if (gistId === 'forked') {
        return GitHubApi.forkGist(lastGist.id).then(forkedGist => GitHubApi.editGist(forkedGist.id, gist));
      }
      return GitHubApi.editGist(gistId, gist);
    };
    save(gist)
      .then(refineGist)
      .then(this.props.setScratchPaper)
      .then(this.props.loadScratchPapers)
      .catch(handleError.bind(this));
  }

  deleteGist() {
    const { scratchPaper } = this.props.current;
    const { gistId } = scratchPaper;
    const deletePromise = ['new', 'forked'].includes(gistId) ? Promise.resolve() : GitHubApi.deleteGist(gistId);
    deletePromise
      .then(() => this.props.loadAlgorithm({}, true))
      .then(this.props.loadScratchPapers)
      .catch(handleError.bind(this));
  }

  render() {
    const { className, onClickTitleBar, navigatorOpened, gistSaved, file } = this.props;
    const { scratchPaper } = this.props.current;
    const titleArray = getTitleArray(this.props.current);
    const { ext, user } = this.props.env;

    return (
      <header className={classes(styles.header, className)}>
        <div className={styles.row}>
          <div className={styles.section}>
            <Button className={styles.title_bar} onClick={onClickTitleBar}>
              {
                titleArray.map((title, i) => [
                  scratchPaper && i === 1 ?
                    <AutosizeInput className={styles.input_title} key={`title-${i}`} value={title}
                                   onClick={e => e.stopPropagation()} onChange={e => this.handleChangeTitle(e)} /> :
                    <Ellipsis key={`title-${i}`}>{title}</Ellipsis>,
                  i < titleArray.length - 1 &&
                  <FontAwesomeIcon className={styles.nav_arrow} fixedWidth icon={faAngleRight} key={`arrow-${i}`} />,
                ])
              }
              <FontAwesomeIcon className={styles.nav_caret} fixedWidth
                               icon={navigatorOpened ? faCaretDown : faCaretRight} />
            </Button>
          </div>
          <div className={styles.section}>
            <Button icon={faSave} primary disabled={!scratchPaper || gistSaved}
                    onClick={() => this.saveGist()}>Save</Button>
            <Button icon={faTrashAlt} primary disabled={!scratchPaper} onClick={() => this.deleteGist()}
                    confirmNeeded>Delete</Button>
            <Button icon={faFacebook} primary disabled={scratchPaper && ['new', 'forked'].includes(scratchPaper.gistId)}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}>Share</Button>
            <Button icon={faExpandArrowsAlt} primary
                    onClick={() => this.handleClickFullScreen()}>Fullscreen</Button>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            {
              user ?
                <Button className={styles.btn_dropdown} icon={user.avatar_url}>
                  {user.login}
                  <div className={styles.dropdown}>
                    <ListItem label="Sign Out" href="/api/auth/destroy" rel="nofollow" />
                  </div>
                </Button> :
                <Button icon={faGithub} primary href="/api/auth/request" rel="nofollow">
                  <Ellipsis>Sign In</Ellipsis>
                </Button>
            }
            <Button className={styles.btn_dropdown} icon={faStar}>
              {languages.find(language => language.ext === ext).name}
              <div className={styles.dropdown}>
                {
                  languages.map(language => language.ext === ext ? null : (
                    <ListItem key={language.ext} onClick={() => this.props.setExt(language.ext)}
                              label={language.name} />
                  ))
                }
              </div>
            </Button>
          </div>
          <Player className={styles.section} file={file} />
        </div>
      </header>
    );
  }
}

export default Header;

