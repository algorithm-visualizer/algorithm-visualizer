import React from 'react';
import { Array1DRenderer, Renderer } from 'core/renderers';
import styles from './Array2DRenderer.module.scss';
import { classes } from 'common/util';

class Array2DRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { data } = this.props.data;

    const isArray1D = this instanceof Array1DRenderer;
    let longestRow = data.reduce((longestRow, row) => longestRow.length < row.length ? row : longestRow, []);

    return (
      <table className={styles.array_2d}
             style={{ marginLeft: -this.centerX * 2, marginTop: -this.centerY * 2, transform: `scale(${this.zoom})` }}>
        <tbody>
        <tr className={styles.row}>
          {
            !isArray1D &&
            <td className={classes(styles.col, styles.index)} />
          }
          {
            longestRow.map((_, i) => (
              <td className={classes(styles.col, styles.index)} key={i}>
                <span className={styles.value}>{i}</span>
              </td>
            ))
          }
        </tr>
        {
          data.map((row, i) => (
            <tr className={styles.row} key={i}>
              {
                !isArray1D &&
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              }
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

