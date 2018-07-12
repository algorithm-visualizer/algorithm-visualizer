import React from 'react';
import { Renderer } from '/core/renderers';
import styles from './stylesheet.scss';
import { classes } from '/common/util';

class Array2DRenderer extends Renderer {
  renderData() {
    const { data } = this.props.data;

    return (
      <table className={styles.array_2d}
             style={{ marginLeft: -this.centerX * 2, marginTop: -this.centerY * 2, fontSize: this.zoom }}>
        <tbody>
        {
          data.map((row, i) => (
            <tr className={styles.row} key={i}>
              {
                row.map((col, j) => (
                  <td className={classes(styles.col, col.selected && styles.selected, col.patched && styles.patched)}
                      key={j}>
                    <span className={styles.value}>{this.toString(col.value)}</span>
                  </td>
                ))
              }
            </tr>
          ))
        }
        </tbody>
      </table>
    );
  }
}

export default Array2DRenderer;

