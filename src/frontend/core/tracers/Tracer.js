class Tracer {
  constructor(title = this.constructor.name, options = {}) {
    this.key = Tracer.seed.addTracer(this.constructor.name, title, options);
    this.register(
      'reset',
      'set',
      'wait',
    );
  }

  register(...functions) {
    for (const func of functions) {
      this[func] = (...args) => {
        Tracer.seed.addTrace(this.key, func, args);
        return this;
      }
    }
  }

  unregister(...functions) {
    for (const func of functions) {
      delete this[func];
    }
  }
}

export default Tracer;

