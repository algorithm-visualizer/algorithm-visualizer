import path from 'path';

class WorkerBuilder {
  constructor() {
    this.workerPath = path.resolve(__dirname, 'js', 'worker.js');

    this.build = this.build.bind(this);
  }

  build(release) {
  }
}

export default WorkerBuilder;
