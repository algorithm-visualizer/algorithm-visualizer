import { Array2DData } from '/core/datas';
import { tracerManager } from '/core';

class Array1DData extends Array2DData {
  init() {
    super.init();
    this.chartData = null;
  }

  render() {
    super.render();
    this.syncChartData();
  }

  set(array1d = []) {
    const array2d = [array1d];
    super.set(array2d);
  }

  notify(x, v) {
    super.notify(0, x, v);
  }

  denotify(x) {
    super.denotify(0, x);
  }

  select(s, e = s) {
    super.select(0, s, 0, e);
  }

  deselect(s, e = s) {
    super.deselect(0, s, 0, e);
  }

  chart(tracerKey) {
    this.chartData = tracerKey ? tracerManager.datas[tracerKey] : null;
    this.syncChartData();
  }

  syncChartData() {
    if (this.chartData) {
      this.chartData.data = this.data;
      this.chartData.render();
    }
  }
}

export default Array1DData;