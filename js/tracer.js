var timer = null;
var lastModule = null, lastData = null;
var stepLimit = 1e6;

var Tracer = function (module) {
    this.module = module || Tracer;
    this.traces = [];
    this.pause = false;
    this.traceOptions = null;
    this.traceIndex = -1;
    this.stepCnt = 0;
    lastData = null;
};

Tracer.prototype.resize = function () {
};

Tracer.prototype.clear = function () {
};

Tracer.prototype.reset = function () {
    this.traces = [];
    this.stepCnt = 0;
    if (timer) clearTimeout(timer);
    $('#tab_trace .wrapper').empty();
    this.clear();
};

Tracer.prototype.createRandomData = function (arguments) {
};

Tracer.prototype.setData = function (arguments) {
    var data = JSON.stringify(arguments);
    if (lastModule == this.module && lastData == data) return true;
    lastModule = this.module;
    lastData = data;
    return false;
};

Tracer.prototype.pushStep = function (step, delay) {
    if (this.stepCnt++ > stepLimit) throw "Tracer's stack overflow";
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

Tracer.prototype._sleep = function (duration) {
    this.pushStep({type: 'sleep', duration: duration}, true);
};

Tracer.prototype._print = function (msg, delay) {
    this.pushStep({type: 'print', msg: msg}, delay);
};

Tracer.prototype._pace = function (interval) {
    this.pushStep({type: 'pace', interval: interval}, false);
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
    var sleepDuration = 0;
    trace.forEach(function (step) {
        switch (step.type) {
            case 'sleep':
                sleepDuration = step.duration;
                break;
            case 'print':
                printTrace(step.msg);
                break;
            case 'pace':
                tracer.traceOptions.interval = step.interval;
                break;
            default:
                tracer.module.prototype.processStep.call(tracer, step, options);
        }
    });
    if (!options.virtual) {
        this.refresh();
        scrollToEnd(Math.min(50, this.traceOptions.interval));
    }
    if (this.pause) return;
    timer = setTimeout(function () {
        tracer.step(i + 1, options);
    }, sleepDuration || this.traceOptions.interval);
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

var scrollToEnd = function (duration) {
    $('#tab_trace').animate({scrollTop: $('#tab_trace')[0].scrollHeight}, duration);
};