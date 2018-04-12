import { serialize } from '/common/util';
import { Tracer } from '/core/tracers';

class Seed {
  constructor() {
    this.tracerCount = 0;
    this.traces = [];
  }

  addTracer(className, title, options) {
    const key = `${this.tracerCount++}-${className}-${title}`;
    const method = 'construct';
    const args = [className, title, options];
    this.addTrace(key, method, args);
    return key;
  }

  addTrace(tracerKey, method, args) {
    const trace = {
      tracerKey,
      method,
      args: serialize(args.map(arg => arg instanceof Tracer ? arg.key : arg)),
    };
    this.traces.push(trace);
  }
}

export default Seed;