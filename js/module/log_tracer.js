const Tracer = require('./tracer');

function LogTracer() {
  if (Tracer.apply(this, arguments)) {
    LogTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

LogTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
  constructor: LogTracer,
  name: 'LogTracer',
  init: function () {
    this.$wrapper = this.capsule.$wrapper = $('<div class="wrapper">');
    this.$container.append(this.$wrapper);
  },
  _print: function (msg) {
    this.manager.pushStep(this.capsule, {
      type: 'print',
      msg: msg
    });
    return this;
  },
  processStep: function (step, options) {
    switch (step.type) {
      case 'print':
        this.print(step.msg);
        break;
    }
  },
  refresh: function () {
    this.scrollToEnd(Math.min(50, this.interval));
  },
  clear: function () {
    Tracer.prototype.clear.call(this);

    this.$wrapper.empty();
  },
  print: function (message) {
    this.$wrapper.append($('<span>').append(message + '<br/>'));
  },
  scrollToEnd: function (duration) {
    this.$container.animate({
      scrollTop: this.$container[0].scrollHeight
    }, duration);
  }
});

module.exports = LogTracer;