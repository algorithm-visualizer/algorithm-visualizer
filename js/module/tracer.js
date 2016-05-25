function Tracer(module) {
    this.module = module || Tracer;
    this.capsule = tm.allocate(this);
    $.extend(this, this.capsule);
    if (this.new) {
        Tracer.prototype.init.call(this);
        return true;
    }
    return false;
}

Tracer.prototype = {
    constructor: Tracer,
    init: function () {
        this.$container.append($('<span class="name">').text(this.name));
    },
    _setData: function (a) {
        var args = Array.prototype.slice.call(arguments);
        tm.pushStep(this.capsule, {type: 'setData', args: toJSON(args)});
        return this;
    },
    _clear: function () {
        tm.pushStep(this.capsule, {type: 'clear'});
        return this;
    },
    _wait: function () {
        tm.newStep();
        return this;
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'setData':
                this.setData.apply(this, fromJSON(step.args));
                break;
            case 'clear':
                this.clear();
                break;
        }
    },
    setData: function () {
        var data = toJSON(arguments);
        if (!this.new && this.lastData == data) return true;
        this.new = this.capsule.new = false;
        this.lastData = this.capsule.lastData = data;
        return false;
    },
    resize: function () {
    },
    refresh: function () {
    },
    clear: function () {
    },
    attach: function (tracer) {
        if (tracer.module == LogTracer) {
            this.logTracer = tracer;
        }
        return this;
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