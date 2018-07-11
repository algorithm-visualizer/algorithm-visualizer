import { Array2DData } from '/core/datas';
import { tracerManager } from '/core';

class Array1DData extends Array2DData {
  init() {
    super.init();
    this.chartData = null;
  }

  set(array1d = []) {
    const array2d = [array1d];
    super.set(array2d);
    this.syncChartData();
  }

  patch(x, v) {
    super.patch(0, x, v);
  }

  depatch(x) {
    super.depatch(0, x);
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
    if (this.chartData) this.chartData.data = this.data;
  }
}

export default Array1DData;