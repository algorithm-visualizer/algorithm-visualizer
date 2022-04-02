import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AutosizeInput from 'react-input-autosize';
import screenfull from 'screenfull';
import Promise from 'bluebird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import faCodeBranch from '@fortawesome/fontawesome-free-solid/faCodeBranch';
import faExpandArrowsAlt from '@fortawesome/fontawesome-free-solid/faExpandArrowsAlt';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import { GitHubApi } from 'apis';
import { classes, refineGist } from 'common/util';
import { actions } from 'reducers';
import { languages } from 'common/config';
import { BaseComponent, Button, Ellipsis, ListItem, Player } from 'components';
import styles from './Header.module.scss';

class Header extends BaseComponent {
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
    const { scratchPaper, titles, files, lastFiles, editingFile } = this.props.current;
    const gist = {
      description: titles[titles.length - 1],
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
      if (scratchPaper && scratchPaper.login) {
        if (scratchPaper.login === user.login) {
          return GitHubApi.editGist(scratchPaper.gistId, gist);
        } else {
          return GitHubApi.forkGist(scratchPaper.gistId).then(forkedGist => GitHubApi.editGist(forkedGist.id, gist));
        }
      }
      return GitHubApi.createGist(gist);
    };
    save(gist)
      .then(refineGist)
      .then(newScratchPaper => {
        this.props.setScratchPaper(newScratchPaper);
        this.props.setEditingFile(newScratchPaper.files.find(file => file.name === editingFile.name));
        if (!(scratchPaper && scratchPaper.gistId === newScratchPaper.gistId)) {
          this.props.history.push(`/scratch-paper/${newScratchPaper.gistId}`);
        }
      })
      .then(this.props.loadScratchPapers)
      .catch(this.handleError);
  }

  hasPermission() {
    const { scratchPaper } = this.props.current;
    const { user } = this.props.env;
    if (!scratchPaper) return false;
    if (scratchPaper.gistId !== 'new') {
      if (!user) return false;
      if (scratchPaper.login !== user.login) return false;
    }
    return true;
  }

  deleteGist() {
    const { scratchPaper } = this.props.current;
    const { gistId } = scratchPaper;
    if (gistId === 'new') {
      this.props.ignoreHistoryBlock(() => this.props.history.push('/'));
    } else {
      GitHubApi.deleteGist(gistId)
        .then(() => {
          this.props.ignoreHistoryBlock(() => this.props.history.push('/'));
        })
        .then(this.props.loadScratchPapers)
        .catch(this.handleError);
    }
  }

  render() {
    const { className, onClickTitleBar, navigatorOpened } = this.props;
    const { scratchPaper, titles, saved } = this.props.current;
    const { ext, user } = this.props.env;

    const permitted = this.hasPermission();

    return (
      <header className={classes(styles.header, className)}>
        <div className={styles.row}>
          <div className={styles.section}>
            <Button className={styles.title_bar} onClick={onClickTitleBar}>
              {
                titles.map((title, i) => [
                  scratchPaper && i === 1 ?
                    <AutosizeInput className={styles.input_title} key={`title-${i}`} value={title}
                                   onClick={e => e.stopPropagation()} onChange={e => this.handleChangeTitle(e)}/> :
                    <Ellipsis key={`title-${i}`}>{title}</Ellipsis>,
                  i < titles.length - 1 &&
                  <FontAwesomeIcon className={styles.nav_arrow} fixedWidth icon={faAngleRight} key={`arrow-${i}`}/>,
                ])
              }
              <FontAwesomeIcon className={styles.nav_caret} fixedWidth
                               icon={navigatorOpened ? faCaretDown : faCaretRight}/>
            </Button>
          </div>
          <div className={styles.section}>
            <Button icon={permitted ? faSave : faCodeBranch} primary disabled={permitted && saved}
                    onClick={() => this.saveGist()}>{permitted ? 'Save' : 'Fork'}</Button>
            {
              permitted &&
              <Button icon={faTrashAlt} primary onClick={() => this.deleteGist()} confirmNeeded>Delete</Button>
            }
            <Button icon={faFacebook} primary
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
                    <ListItem label="Sign Out" href="/api/auth/destroy" rel="opener"/>
                  </div>
                </Button> :
                <Button icon={faGithub} primary href="/api/auth/request" rel="opener">
                  <Ellipsis>Sign In</Ellipsis>
                </Button>
            }
            <Button className={styles.btn_dropdown} icon={faStar}>
              {languages.find(language => language.ext === ext).name}
              <div className={styles.dropdown}>
                {
                  languages.map(language => language.ext === ext ? null : (
                    <ListItem key={language.ext} onClick={() => this.props.setExt(language.ext)}
                              label={language.name}/>
                  ))
                }
              </div>
            </Button>
          </div>
          <Player className={styles.section}/>
        </div>
      </header>
    );
  }
}

export default withRouter(
  connect(({ current, env }) => ({ current, env }), actions)(
    Header,
  ),
);

