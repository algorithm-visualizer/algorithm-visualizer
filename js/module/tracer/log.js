const Tracer = require('./tracer');

class LogTracer extends Tracer {
  static getClassName() {
    return 'LogTracer';
  }

  constructor(name) {
    super(name);

    if (this.isNew) initView(this);
  }

  _print(msg) {
    this.manager.pushStep(this.capsule, {
      type: 'print',
      msg: msg
    });
    return this;
  }

  processStep(step, options) {
    switch (step.type) {
      case 'print':
        this.print(step.msg);
        break;
    }
  }

  refresh() {
    this.scrollToEnd(Math.min(50, this.interval));
  }

  clear() {
    super.clear();

    this.$wrapper.empty();
  }

  print(message) {
    this.$wrapper.append($('<span>').append(message + '<br/>'));
  }

  scrollToEnd(duration) {
    this.$container.animate({
      scrollTop: this.$container[0].scrollHeight
    }, duration);
  }
}

const initView = (tracer) => {
  tracer.$wrapper = tracer.capsule.$wrapper = $('<div class="wrapper">');
  tracer.$container.append(tracer.$wrapper);
};

module.exports = LogTracer;