import { Tracer } from 'core/tracers';
import { Array2DRenderer } from 'core/renderers';

class Element {
  constructor(value) {
    this.value = value;
    this.patched = false;
    this.selected = false;
  }
}

class Array2DTracer extends Tracer {
  getRendererClass() {
    return Array2DRenderer;
  }

  set(array2d = []) {
    this.data = array2d.map(array1d => [...array1d].map(value => new Element(value)));
    super.set();
  }

  patch(x, y, v = this.data[x][y].value) {
    if (!this.data[x][y]) this.data[x][y] = new Element();
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

export default Array2DTracer;
