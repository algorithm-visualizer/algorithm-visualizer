import faChevronLeft from "@fortawesome/fontawesome-free-solid/faChevronLeft";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";
import faPause from "@fortawesome/fontawesome-free-solid/faPause";
import faPlay from "@fortawesome/fontawesome-free-solid/faPlay";
import faWrench from "@fortawesome/fontawesome-free-solid/faWrench";
import { classes, extension } from "common/util";
import { BaseComponent, Button, ProgressBar } from "components";
import React from "react";
import { connect } from "react-redux";
import { actions } from "reducers";
import * as AlgorithmVisualizer from "../../common/AlgorithmVisualizer";
import styles from "./Player.module.scss";

class Player extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      speed: 2,
      playing: false,
      building: false,
    };

    this.reset();
  }

  componentDidMount() {
    const { editingFile, shouldBuild } = this.props.current;
    if (shouldBuild) this.build(editingFile);
  }

  componentWillReceiveProps(nextProps) {
    const { editingFile, shouldBuild } = nextProps.current;
    if (editingFile !== this.props.current.editingFile) {
      if (shouldBuild) this.build(editingFile);
    }
  }

  reset(commands = []) {
    const chunks = [
      {
        commands: [],
        lineNumber: undefined,
      },
    ];
    while (commands.length) {
      const command = commands.shift();
      const { key, method, args } = command;
      if (key === null && method === "delay") {
        const [lineNumber] = args;
        chunks[chunks.length - 1].lineNumber = lineNumber;
        chunks.push({
          commands: [],
          lineNumber: undefined,
        });
      } else {
        chunks[chunks.length - 1].commands.push(command);
      }
    }
    this.props.setChunks(chunks);
    this.props.setCursor(0);
    this.pause();
    this.props.setLineIndicator(undefined);
  }

  getCommands(content, ext) {
    switch (ext) {
      case "md":
        return [
          {
            key: "markdown",
            method: "MarkdownTracer",
            args: ["Markdown"],
          },
          {
            key: "markdown",
            method: "set",
            args: [content],
          },
          {
            key: null,
            method: "setRoot",
            args: ["markdown"],
          },
        ];
      case "js":
        const code = content
          .split("\n")
          .map((line, i) => line.replace(/(\.\s*delay\s*)\(\s*\)/g, `$1(${i})`))
          .join("\n");
        // eslint-disable-next-line no-unused-vars
        const process = { env: { ALGORITHM_VISUALIZER: "1" } };
        // eslint-disable-next-line no-unused-vars
        const require = (name) =>
          ({ "algorithm-visualizer": AlgorithmVisualizer }[name]); // fake require
        // eslint-disable-next-line no-eval
        eval(code);
        return AlgorithmVisualizer.Commander.commands;
      default:
        return null;
    }
  }

  build(file) {
    this.reset();
    if (!file) return;
    this.setState({ building: true });

    setTimeout(() => {
      try {
        const ext = extension(file.name);
        if (ext === "md" || ext === "js") {
          const commands = this.getCommands(file.content, ext);
          this.reset(commands);
          this.next();
        } else {
          throw new Error("Language Not Supported");
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.setState({ building: false });
      }
    });
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
    if (this.next() || (wrap && this.props.setCursor(1))) {
      const interval = 4000 / Math.pow(Math.E, this.state.speed);
      this.timer = window.setTimeout(() => this.resume(), interval);
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

  handleChangeSpeed(speed) {
    this.setState({ speed });
  }

  handleChangeProgress(progress) {
    const { chunks } = this.props.player;
    const cursor = Math.max(
      1,
      Math.min(chunks.length, Math.round(progress * chunks.length))
    );
    this.pause();
    this.props.setCursor(cursor);
  }

  render() {
    const { className } = this.props;
    const { editingFile } = this.props.current;
    const { chunks, cursor } = this.props.player;
    const { speed, playing, building } = this.state;

    return (
      <div className={classes(styles.player, className)}>
        <Button
          icon={faWrench}
          primary
          disabled={building}
          inProgress={building}
          onClick={() => this.build(editingFile)}
        >
          {building ? "Building" : "Build"}
        </Button>
        {playing ? (
          <Button icon={faPause} primary active onClick={() => this.pause()}>
            Pause
          </Button>
        ) : (
          <Button icon={faPlay} primary onClick={() => this.resume(true)}>
            Play
          </Button>
        )}
        <Button
          icon={faChevronLeft}
          primary
          disabled={!this.isValidCursor(cursor - 1)}
          onClick={() => this.prev()}
        />
        <ProgressBar
          className={styles.progress_bar}
          current={cursor}
          total={chunks.length}
          onChangeProgress={(progress) => this.handleChangeProgress(progress)}
        />
        <Button
          icon={faChevronRight}
          reverse
          primary
          disabled={!this.isValidCursor(cursor + 1)}
          onClick={() => this.next()}
        />
        {/*         <div className={styles.speed}>
          Speed
          {           <InputRange
            classNames={{
              inputRange: styles.range,
              labelContainer: styles.range_label_container,
              slider: styles.range_slider,
              track: styles.range_track,
            }}
            minValue={0}
            maxValue={4}
            step={0.5}
            value={speed}
            onChange={(speed) => this.handleChangeSpeed(speed)}
          /> }
        </div> */}
      </div>
    );
  }
}

export default connect(
  ({ current, player }) => ({ current, player }),
  actions
)(Player);
