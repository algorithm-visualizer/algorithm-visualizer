import { Array2DTracer } from 'core/tracers';
import { Array1DRenderer } from 'core/renderers';

class Array1DTracer extends Array2DTracer {
  getRendererClass() {
    return Array1DRenderer;
  }

  init() {
    super.init();
    this.chartTracer = null;
  }

  set(array1d = []) {
    const array2d = [array1d];
    super.set(array2d);
    this.syncChartTracer();
  }

  patch(x, v) {
    super.patch(0, x, v);
  }

  depatch(x) {
    super.depatch(0, x);
  }

  select(sx, ex = sx) {
    super.select(0, sx, 0, ex);
  }

  deselect(sx, ex = sx) {
    super.deselect(0, sx, 0, ex);
  }

  chart(key) {
    this.chartTracer = key ? this.getObject(key) : null;
    this.syncChartTracer();
  }

  syncChartTracer() {
    if (this.chartTracer) this.chartTracer.data = this.data;
  }
}

export default Array1DTracer;
