import React from 'react';
import { Renderer } from '/core/renderers';
import styles from './stylesheet.scss';
import { classes } from '/common/util';

class Array2DRenderer extends Renderer {
  renderData() {
    const { data } = this.props.data;

    return (
      <div className={styles.array_2d}
           style={{ marginLeft: -this.centerX * 2, marginTop: -this.centerY * 2, fontSize: this.zoom }}>
        {
          data.map((row, i) => (
            <div className={styles.row} key={i}>
              {
                row.map((col, j) => (
                  <div className={classes(styles.col, col.selected && styles.selected, col.notified && styles.notified)}
                       key={j}>
                    <span className={styles.value}>{col.value}</span>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default Array2DRenderer;

