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
    _setData: function () {
        tm.pushStep(this.capsule, {type: 'setData', arguments: arguments});
    },
    _clear: function () {
        tm.pushStep(this.capsule, {type: 'clear'});
    },
    _next: function () {
        tm.newStep();
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'setData':
                this.setData.apply(this, step.arguments);
                break;
            case 'clear':
                this.clear();
                break;
        }
    },
    setData: function () {
        var data = JSON.stringify(arguments);
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
    mousedown: function (e) {
    },
    mousemove: function (e) {
    },
    mouseup: function (e) {
    },
    mousewheel: function (e) {
    }
};