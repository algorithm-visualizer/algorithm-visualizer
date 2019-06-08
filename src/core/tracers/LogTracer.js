import { sprintf } from 'sprintf-js';
import { Tracer } from 'core/tracers';
import { LogRenderer } from 'core/renderers';

class LogTracer extends Tracer {
  getRendererClass() {
    return LogRenderer;
  }

  set(log = '') {
    this.log = log;
    super.set();
  }

  print(message) {
    this.log += message;
  }

  println(message) {
    this.print(message + '\n');
  }

  printf(format, ...args) {
    this.print(sprintf(format, ...args));
  }
}

export default LogTracer;
