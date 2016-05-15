var timer = null;
var lastModule = null, lastData = null;

var Tracer = function (module) {
    this.module = module;
    this.traces = [];
    this.pause = false;
    this.traceOptions = null;
    this.traceIndex = -1;
    this.lastData = null;
};

Tracer.prototype.resize = function () {
};

Tracer.prototype.reset = function () {
    this.traces = [];
    if (timer) clearTimeout(timer);
    $('#tab_trace .wrapper').empty();
};

Tracer.prototype.setData = function (arguments) {
    var data = JSON.stringify(arguments);
    if (lastModule == this.module && lastData == data) return true;
    lastModule = this.module;
    lastData = data;
    return false;
};

Tracer.prototype.pushStep = function (step, delay) {
    var len = this.traces.length;
    var last = [];
    if (len == 0) {
        this.traces.push(last);
    } else {
        last = this.traces[len - 1];
    }
    last.push(step);
    if (delay) this.traces.push([]);
};

Tracer.prototype.print = function (msg, delay) {
    this.pushStep({type: 'print', msg: msg}, delay);
};

Tracer.prototype.visualize = function (options) {
    options = options || {};
    options.interval = options.interval || 500;

    $('#btn_trace').click();
    this.traceOptions = options;
    this.traceIndex = -1;
    this.resumeStep();
};

Tracer.prototype.isPause = function () {
    return this.pause;
};

Tracer.prototype.pauseStep = function () {
    if (this.traceIndex < 0) return;
    this.pause = true;
    if (timer) clearTimeout(timer);
    $('#btn_pause').addClass('active');
};

Tracer.prototype.resumeStep = function () {
    this.pause = false;
    this.step(this.traceIndex + 1);
    $('#btn_pause').removeClass('active');
};

Tracer.prototype.step = function (i, options) {
    if (isNaN(i) || i >= this.traces.length || i < 0) return;
    options = options || {};

    this.traceIndex = i;
    var trace = this.traces[i];
    var tracer = this;
    trace.forEach(function (step, i) {
        switch (step.type) {
            case 'print':
                printTrace(step.msg);
                break;
            default:
                tracer.module.prototype.processStep.call(tracer, step, options);
        }
    });
    if (!options.virtual) {
        this.refresh();
        scrollToEnd();
    }
    if (this.pause) return;
    timer = setTimeout(function () {
        tracer.step(i + 1, options);
    }, this.traceOptions.interval);
};

Tracer.prototype.refresh = function () {
};

Tracer.prototype.prevStep = function () {
    this.step(this.traceIndex - 1);
};

Tracer.prototype.nextStep = function () {
    this.step(this.traceIndex + 1);
};

var printTrace = function (message) {
    $('#tab_trace .wrapper').append($('<span>').append(message + '<br/>'));
};

var scrollToEnd = function () {
    $('#tab_trace').animate({scrollTop: $('#tab_trace')[0].scrollHeight}, 100);
};