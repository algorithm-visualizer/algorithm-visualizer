import { Tracer } from '/core/tracers';

class LogTracer extends Tracer {
  constructor(title, options) {
    super(title, options);

    this.register(
      'print',
    );
  }
}

export default LogTracer;