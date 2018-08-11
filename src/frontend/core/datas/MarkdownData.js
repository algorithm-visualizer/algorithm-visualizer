import { Data } from '/core/datas';
import { MarkdownRenderer } from '/core/renderers';

class MarkdownData extends Data {
  getRendererClass() {
    return MarkdownRenderer;
  }

  set(markdown = '') {
    this.markdown = markdown;
    super.set();
  }
}

export default MarkdownData;
