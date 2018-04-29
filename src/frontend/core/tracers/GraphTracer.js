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

GraphTracer.LAYOUT = {
  CIRCLE: 'circle',
  TREE: 'tree',
  RANDOM: 'random',
  NONE: 'none',
  // FORCE_DIRECTED: 'force_directed',
};

export default GraphTracer;