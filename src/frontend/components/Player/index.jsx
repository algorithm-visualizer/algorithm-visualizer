import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import InputRange from 'react-input-range';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import { classes, extension, handleError } from '/common/util';
import { TracerApi } from '/apis';
import { actions } from '/reducers';
import { Button, ProgressBar } from '/components';
import styles from './stylesheet.scss';

@connect(({ player }) => ({ player }), actions)
class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interval: 500,
      playing: false,
      building: false,
    };

    this.reset();
  }

  componentDidMount() {
    const { file } = this.props;
    this.build(file);
  }

  componentWillReceiveProps(nextProps) {
    const { file } = nextProps;
    const { buildAt } = nextProps.player;
    if (buildAt !== this.props.player.buildAt) {
      this.build(file);
    }
  }

  reset(traces = []) {
    const chunks = [{
      traces: [],
      lineNumber: undefined,
    }];
    while (traces.length) {
      const trace = traces.shift();
      if (trace.method === 'delay') {
        const [lineNumber] = trace.args;
        chunks[chunks.length - 1].lineNumber = lineNumber;
        chunks.push({
          traces: [],
          lineNumber: undefined,
        });
      } else {
        chunks[chunks.length - 1].traces.push(trace);
      }
    }
    this.props.setChunks(chunks);
    this.props.setCursor(0);
    this.pause();
    this.props.setLineIndicator(undefined);
  }

  build(file) {
    if (!file) return;
    this.setState({ building: true });
    this.reset();
    const ext = extension(file.name);
    (ext in TracerApi ?
      TracerApi[ext]({ code: file.content }) :
      Promise.reject(new Error('Language Not Supported')))
      .then(traces => this.reset(traces))
      .then(() => this.next())
      .catch(handleError.bind(this))
      .finally(() => this.setState({ building: false }));
  }

  isValidCursor(cursor) {
    const { chunks } = this.props.player;
    return 1 <= cursor && cursor <= chunks.length;
  }

  prev() {
    this.pause();
    const cursor = this.props.player.cursor - 1;
    if (!this.isValidCursor(cursor)) return false;
    this.props.setCursor(cursor);
    return true;
  }

  resume(wrap = false) {
    this.pause();
    if (this.next() || wrap && this.props.setCursor(1)) {
      this.timer = window.setTimeout(() => this.resume(), this.state.interval);
      this.setState({ playing: true });
    }
  }

  pause() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
      this.setState({ playing: false });
    }
  }

  next() {
    this.pause();
    const cursor = this.props.player.cursor + 1;
    if (!this.isValidCursor(cursor)) return false;
    this.props.setCursor(cursor);
    return true;
  }

  handleChangeInterval(interval) {
    this.setState({ interval });
  }

  handleChangeProgress(progress) {
    const { chunks } = this.props.player;
    const cursor = Math.max(1, Math.min(chunks.length, Math.round(progress * chunks.length)));
    this.pause();
    this.props.setCursor(cursor);
  }

  render() {
    const { className, file } = this.props;
    const { chunks, cursor } = this.props.player;
    const { interval, playing, building } = this.state;

    return (
      <div className={classes(styles.player, className)}>
        <Button icon={faWrench} primary disabled={building} inProgress={building} onClick={() => this.build(file)}>
          {building ? 'Building' : 'Build'}
        </Button>
        {
          playing ? (
            <Button icon={faPause} primary active onClick={() => this.pause()}>Pause</Button>
          ) : (
            <Button icon={faPlay} primary onClick={() => this.resume(true)}>Play</Button>
          )
        }
        <Button icon={faChevronLeft} primary disabled={!this.isValidCursor(cursor - 1)} onClick={() => this.prev()} />
        <ProgressBar className={styles.progress_bar} current={cursor} total={chunks.length}
                     onChangeProgress={progress => this.handleChangeProgress(progress)} />
        <Button icon={faChevronRight} reverse primary disabled={!this.isValidCursor(cursor + 1)}
                onClick={() => this.next()} />
        <div className={styles.interval}>
          Speed
          <InputRange
            classNames={{
              inputRange: styles.range,
              labelContainer: styles.range_label_container,
              slider: styles.range_slider,
              track: styles.range_track,
            }} maxValue={2000} minValue={100} step={100} value={interval}
            onChange={interval => this.handleChangeInterval(interval)} />
        </div>
      </div>
    );
  }
}

export default Player;
