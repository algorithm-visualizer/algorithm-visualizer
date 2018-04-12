import React from 'react';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import screenfull from 'screenfull';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faShare from '@fortawesome/fontawesome-free-solid/faShare';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faExpandArrowsAlt from '@fortawesome/fontawesome-free-solid/faExpandArrowsAlt';
import { actions as envActions } from '/reducers/env';
import { actions as tracerActions } from '/reducers/tracer';
import { classes } from '/common/util';
import { Button, Ellipsis } from '/components';
import { tracerManager } from '/core';
import styles from './stylesheet.scss';

@connect(
  ({ env, tracer }) => ({
    env,
    tracer,
  }), {
    ...envActions,
    ...tracerActions,
  }
)
class Header extends React.Component {
  constructor(props) {
    super(props);

    const { interval, paused, started } = tracerManager;
    this.state = { interval, paused, started };
  }

  componentDidMount() {
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
    const { interval, paused, started } = this.state;
    const { className, onClickTitleBar, navigatorOpened } = this.props;
    const { categories, categoryKey, algorithmKey } = this.props.env;
    const { data, code } = this.props.tracer;

    const { name: categoryName, list: algorithmList } = categories[categoryKey];
    const algorithmName = algorithmList[algorithmKey];

    return (
      <header className={classes(styles.header, className)}>
        <Button className={styles.title_bar} onClick={onClickTitleBar}>
          <Ellipsis>{categoryName}</Ellipsis>
          <FontAwesomeIcon className={styles.nav_arrow} fixedWidth icon={faAngleRight} />
          <Ellipsis>{algorithmName}</Ellipsis>
          <FontAwesomeIcon className={styles.nav_caret} fixedWidth
                           icon={navigatorOpened ? faCaretDown : faCaretRight} />
        </Button>
        <div className={styles.top_menu_buttons}>
          <Button icon={faPencilAlt} primary>Generate</Button>
          <Button icon={faShare} primary>
            Share
            <input type="text" className={classes(styles.collapse, styles.shared)} />
          </Button>
          {
            started ? (
              <Button icon={faPlay} primary onClick={() => tracerManager.run(data, code)} active>Rerun</Button>
            ) : (
              <Button icon={faPlay} primary onClick={() => tracerManager.run(data, code)}>Run</Button>
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
          <Button className={styles.btn_fullscreen} icon={faExpandArrowsAlt} primary
                  onClick={() => this.handleClickFullScreen()}>Fullscreen</Button>
        </div>
      </header>
    );
  }
}

export default Header;

