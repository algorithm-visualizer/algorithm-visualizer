import { Array2DTracer } from '/core/tracers';

class Array1DTracer extends Array2DTracer {
  constructor(title, options) {
    super(title, options);

    this.unregister(
      'selectRow',
      'selectCol',
      'deselectRow',
      'deselectCol',
    );

    this.register(
      'chart'
    );
  }
}

export default Array1DTracer;