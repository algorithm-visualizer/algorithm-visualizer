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

    var moduleChanged = lastModule != module;
    if (moduleChanged) $module_container.empty();
    return moduleChanged;
};

Tracer.prototype = {
    resize: function () {
    },
    clear: function () {
        $('#tab_trace .wrapper').text ('');
    },
    reset: function () {
        this.traces = [];
        this.stepCnt = 0;
        if (timer) clearTimeout(timer);
        $('#tab_trace .wrapper').empty();
        this.clear();
    },
    _setData: function (arguments) {
        var data = JSON.stringify(arguments);
        if (lastModule == this.module && lastData == data) return true;
        lastData = data;
        return false;
    },
    pushStep: function (step, delay) {
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
    },
    _sleep: function (duration) {
        this.pushStep({type: 'sleep', duration: duration}, true);
    },
    _print: function (msg, delay) {
        this.pushStep({type: 'print', msg: msg}, delay);
    },
    _pace: function (interval) {
        this.pushStep({type: 'pace', interval: interval}, false);
    },
    _clear: function () {
        this.pushStep({type: 'clear'}, true);
    },
    visualize: function (options) {
        options = options || {};
        options.interval = options.interval || 500;

        $('#btn_trace').click();
        this.traceOptions = options;
        this.traceIndex = -1;
        this.resumeStep();
    },
    isPause: function () {
        return this.pause;
    },
    pauseStep: function () {
        if (this.traceIndex < 0) return;
        this.pause = true;
        if (timer) clearTimeout(timer);
        $('#btn_pause').addClass('active');
    },
    resumeStep: function () {
        this.pause = false;
        this.step(this.traceIndex + 1);
        $('#btn_pause').removeClass('active');
    },
    step: function (i, options) {
        var tracer = this;

        if (isNaN(i) || i >= this.traces.length || i < 0) return;
        options = options || {};

        this.traceIndex = i;
        var trace = this.traces[i];
        var sleepDuration = 0;
        trace.forEach(function (step) {
            switch (step.type) {
                case 'sleep':
                    sleepDuration = step.duration;
                    break;
                case 'print':
                    tracer.printTrace(step.msg);
                    break;
                case 'pace':
                    tracer.traceOptions.interval = step.interval;
                    break;
                case 'clear':
                    tracer.clear();
                    tracer.printTrace('clear traces');
                    break;
                default:
                    tracer.module.prototype.processStep.call(tracer, step, options);
            }
        });
        if (!options.virtual) {
            this.refresh();
            this.scrollToEnd(Math.min(50, this.traceOptions.interval));
        }
        if (this.pause) return;
        timer = setTimeout(function () {
            tracer.step(i + 1, options);
        }, sleepDuration || this.traceOptions.interval);
    },
    refresh: function () {
    },
    prevStep: function () {
        this.step(this.traceIndex - 1);
    },
    nextStep: function () {
        this.step(this.traceIndex + 1);
    },
    mousedown: function (e) {
    },
    mousemove: function (e) {
    },
    mouseup: function (e) {
    },
    mousewheel: function (e) {
    },
    printTrace: function (message) {
        $('#tab_trace .wrapper').append($('<span>').append(message + '<br/>'));
    },
    scrollToEnd: function (duration) {
        $('#tab_trace').animate({scrollTop: $('#tab_trace')[0].scrollHeight}, duration);
    }
};
