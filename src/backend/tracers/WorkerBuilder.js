import path from 'path';
import { download } from '/common/util';

class WorkerBuilder {
  constructor() {
    this.tracerPath = path.resolve(__dirname, '..', 'public', 'algorithm-visualizer.js');
    this.workerPath = path.resolve(__dirname, 'js', 'worker.js');

    this.build = this.build.bind(this);
  }

  build(release) {
    const { tag_name } = release;
    return download(`https://github.com/algorithm-visualizer/tracers.js/releases/download/${tag_name}/algorithm-visualizer.js`, this.tracerPath);
  }
}

export default WorkerBuilder;
