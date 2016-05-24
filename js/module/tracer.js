var Tracer = function (module) {
    this.module = module || Tracer;
    this.capsule = tm.allocate(this);

    $.extend(this, this.capsule);
    return this.new;
};

Tracer.prototype = {
    _setData: function (arguments) {
        var data = JSON.stringify(arguments);
        if (!this.new && this.lastData == data) return true;
        this.capsule.lastData = data;
        return false;
    },
    _clear: function () {
        tm.pushStep(this.capsule, {type: 'clear'});
    },
    _next: function () {
        tm.newStep();
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'clear':
                this.clear();
                break;
        }
    },
    resize: function () {
    },
    refresh: function () {
    },
    clear: function () {
    },
    mousedown: function (e) {
    },
    mousemove: function (e) {
    },
    mouseup: function (e) {
    },
    mousewheel: function (e) {
    }
};