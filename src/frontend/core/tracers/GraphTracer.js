import { Tracer } from '/core/tracers';

class GraphTracer extends Tracer {
  constructor(title, options) {
    super(title, options);

    this.register(
      'visit',
      'leave',
      'log',
    );
  }
}

export default GraphTracer;