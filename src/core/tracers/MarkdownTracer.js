import { Tracer } from 'core/tracers';
import { MarkdownRenderer } from 'core/renderers';

class MarkdownTracer extends Tracer {
  getRendererClass() {
    return MarkdownRenderer;
  }

  set(markdown = '') {
    this.markdown = markdown;
    super.set();
  }
}

export default MarkdownTracer;
