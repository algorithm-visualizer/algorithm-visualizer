import { Array2DTracer } from 'core/tracers';
import { ScatterRenderer } from 'core/renderers';

class ScatterTracer extends Array2DTracer {
  getRendererClass() {
    return ScatterRenderer;
  }
}

export default ScatterTracer;
