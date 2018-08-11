import { Array1DData } from '/core/datas';
import { ChartRenderer } from '/core/renderers';

class ChartData extends Array1DData {
  getRendererClass() {
    return ChartRenderer;
  }
}

export default ChartData;
