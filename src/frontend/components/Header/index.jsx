import React from 'react';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import screenfull from 'screenfull';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faExpandArrowsAlt from '@fortawesome/fontawesome-free-solid/faExpandArrowsAlt';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { actions as envActions } from '/reducers/env';
import { GitHubApi } from '/apis';
import { classes } from '/common/util';
import { Button, Ellipsis, ListItem } from '/components';
import { tracerManager } from '/core';
import styles from './stylesheet.scss';

@connect(
  ({ env }) => ({
    env,
  }), {
    ...envActions,
  }
)
class Header extends React.Component {
  constructor(props) {
    super(props);

    const { interval, paused, started } = tracerManager;
    this.state = {
      interval, paused, started,
      profile: {
        avatar_url: null,
        login: null,
      },
    };
  }

  componentDidMount() {
    const { signedIn } = this.props.env;
    if (signedIn) {
      GitHubApi.getProfile()
        .then(result => {
          const { avatar_url, login } = result;
          const profile = { avatar_url, login };
          this.setState({ profile });
        });
    }

    tracerManager.setOnUpdateStatus(update => this.setState(update));
  }

  componentWillUnmount() {
    tracerManager.setOnUpdateStatus(null);
  }

  handleClickFullScreen() {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  }

  render() {
    const { interval, paused, started, profile } = this.state;
    const { className, onClickTitleBar, navigatorOpened } = this.props;
    const { hierarchy, categoryKey, algorithmKey, signedIn } = this.props.env;

    let directory = ['Algorithm Visualizer'];
    if (hierarchy && categoryKey && algorithmKey) {
      const category = hierarchy.find(category => category.key === categoryKey);
      const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
      directory = [category.name, algorithm.name];
    }

    return (
      <header className={classes(styles.header, className)}>
        <Button className={styles.title_bar} onClick={onClickTitleBar}>
          {
            directory.map((path, i) => [
              <Ellipsis key={`path-${i}`}>{path}</Ellipsis>,
              i < directory.length - 1 &&
              <FontAwesomeIcon className={styles.nav_arrow} fixedWidth icon={faAngleRight} key={`arrow-${i}`} />
            ])
          }
          <FontAwesomeIcon className={styles.nav_caret} fixedWidth
                           icon={navigatorOpened ? faCaretDown : faCaretRight} />
        </Button>
        <div className={styles.top_menu_buttons}>
          {
            started ? (
              <Button icon={faPlay} primary onClick={() => tracerManager.run()} active>Rerun</Button>
            ) : (
              <Button icon={faPlay} primary onClick={() => tracerManager.run()}>Run</Button>
            )
          }
          <Button icon={faChevronLeft} primary disabled={!started}
                  onClick={() => tracerManager.prev()}>Prev</Button>
          {
            paused ? (
              <Button icon={faPause} primary onClick={() => tracerManager.resume()} active>Resume</Button>
            ) : (
              <Button icon={faPause} primary disabled={!started}
                      onClick={() => tracerManager.pause()}>Pause</Button>
            )
          }
          <Button icon={faCaretRight} reverse primary disabled={!started}
                  onClick={() => tracerManager.next()}>Next</Button>
          <div className={styles.interval}>
            Speed
            <InputRange
              classNames={{
                inputRange: styles.range,
                labelContainer: styles.range_label_container,
                slider: styles.range_slider,
                track: styles.range_track,
              }}
              maxValue={2000}
              minValue={100}
              step={100}
              value={interval}
              onChange={interval => tracerManager.setInterval(interval)} />
          </div>
          {
            signedIn ?
              <Button className={styles.btn_profile} icon={profile.avatar_url}>
                {profile.login}
                <div className={styles.dropdown}>
                  <Button className={styles.fake} icon={profile.avatar_url}>
                    {profile.login}
                  </Button>
                  <div className={styles.list}>
                    <ListItem href="/api/auth/destroy" label="Sign Out" />
                  </div>
                </div>
              </Button> :
              <Button icon={faGithub} primary href="/api/auth/request">
                Sign In
              </Button>
          }
          <Button icon={faExpandArrowsAlt} primary
                  onClick={() => this.handleClickFullScreen()}>Fullscreen</Button>
        </div>
      </header>
    );
  }
}

export default Header;

