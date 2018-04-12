import { Data } from '/core/datas';

class Array2DData extends Data {
  set(array2d = []) {
    this.data = [];
    for (const array1d of array2d) {
      const row = [];
      for (const value of array1d) {
        const col = {
          value,
          notified: false,
          selected: false,
        };
        row.push(col);
      }
      this.data.push(row);
    }
    super.set();
  }

  notify(x, y, v) {
    this.data[x][y].value = v;
    this.data[x][y].notified = true;
    this.render();
  }

  denotify(x, y) {
    this.data[x][y].notified = false;
    this.render();
  }

  select(sx, sy, ex = sx, ey = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        this.data[x][y].selected = true;
      }
    }
    this.render();
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
    this.render();
  }

  deselectRow(x, sy, ey) {
    this.deselect(x, sy, x, ey);
  }

  deselectCol(y, sx, ex) {
    this.deselect(sx, y, ex, y);
  }
}

export default Array2DData;