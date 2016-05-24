function LogTracer(module) {
    return Tracer.call(this, module || LogTracer);
}

LogTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: LogTracer,
    _print: function (msg, delay) {
        tm.pushStep(this.capsule, {type: 'print', msg: msg}, delay);
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'print':
                this.printTrace(step.msg);
                break;
        }
    },
    refresh: function () {
        this.scrollToEnd(Math.min(50, this.interval));
    },
    printTrace: function (message) {
        $('#tab_trace .wrapper').append($('<span>').append(message + '<br/>'));
    },
    scrollToEnd: function (duration) {
        $('#tab_trace').animate({scrollTop: $('#tab_trace')[0].scrollHeight}, duration);
    }
});