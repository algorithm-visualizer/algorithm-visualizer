import { Tracer } from '/core/tracers';

class Array2DTracer extends Tracer {
  constructor(title, options) {
    super(title, options);

    this.register(
      'notify',
      'denotify',
      'select',
      'selectRow',
      'selectCol',
      'deselect',
      'deselectRow',
      'deselectCol',
    );
  }
}

export default Array2DTracer;