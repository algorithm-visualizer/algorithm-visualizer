import { Tracer } from '/core/tracers';

class GraphTracer extends Tracer {
  constructor(title, options) {
    super(title, options);

    this.register(
      'addNode',
      'addEdge',
      'layoutCircle',
      'layoutTree',
      'layoutRandom',
      'visit',
      'leave',
      'select',
      'deselect',
      'log',
    );
  }
}

export default GraphTracer;