import { Data } from '/core/datas';
import { Array2DRenderer } from '/core/renderers';

class Array2DData extends Data {
  getRendererClass() {
    return Array2DRenderer;
  }

  set(array2d = []) {
    this.data = [];
    for (const array1d of array2d) {
      const row = [];
      for (const value of array1d) {
        const col = {
          value,
          patched: false,
          selected: false,
        };
        row.push(col);
      }
      this.data.push(row);
    }
    super.set();
  }

  patch(x, y, v = this.data[x][y].value) {
    this.data[x][y].value = v;
    this.data[x][y].patched = true;
  }

  depatch(x, y) {
    this.data[x][y].patched = false;
  }

  select(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].selected = true;
      }
    }
  }

  selectRow(x, sy, ey) {
    this.select(x, sy, x, ey);
  }

  selectCol(y, sx, ex) {
    this.select(sx, y, ex, y);
  }

  deselect(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].selected = false;
      }
    }
  }

  deselectRow(x, sy, ey) {
    this.deselect(x, sy, x, ey);
  }

  deselectCol(y, sx, ex) {
    this.deselect(sx, y, ex, y);
  }
}

export default Array2DData;
