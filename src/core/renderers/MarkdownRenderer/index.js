import React from "react";
import { Renderer } from "core/renderers";
import styles from "./MarkdownRenderer.module.scss";
import ReactMarkdown from "react-markdown";

class MarkdownRenderer extends Renderer {
  renderData() {
    const { markdown } = this.props.data;

    const image = (src) => {
      let newSrc = src;
      let style = { maxWidth: "100%" };
      const CODECOGS = "https://latex.codecogs.com/svg.latex?";
      const WIKIMEDIA_IMAGE = "https://upload.wikimedia.org/wikipedia/";
      const WIKIMEDIA_MATH =
        "https://wikimedia.org/api/rest_v1/media/math/render/svg/";
      if (src.startsWith(CODECOGS)) {
        const latex = src.substring(CODECOGS.length);
        newSrc = `${CODECOGS}\\color{White}${latex}`;
      } else if (src.startsWith(WIKIMEDIA_IMAGE)) {
        style.backgroundColor = "white";
      } else if (src.startsWith(WIKIMEDIA_MATH)) {
        style.filter = "invert(100%)";
      }
      return <img src={newSrc} style={style} />;
    };

    return (
      <div className={styles.markdown}>
        <ReactMarkdown
          className={styles.content}
          children={markdown}
          components={{
            img: ({ node, ...props }) => image(props.src),
          }}
        />
      </div>
    );
  }
}

export default MarkdownRenderer;
