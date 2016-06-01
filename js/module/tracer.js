const {
    toJSON,
    fromJSON
} = require('../tracer_manager/util');

function Tracer(name) {
    this.module = this.constructor;
    this.capsule = this.manager.allocate(this);
    $.extend(this, this.capsule);
    this.setName(name);
    return this.isNew;
}

Tracer.prototype = {

    constructor: Tracer,
    manager: null,

    _setData(...args) {
        this.manager.pushStep(this.capsule, {
            type: 'setData',
            args: toJSON(args)
        });
        return this;
    },

    _clear() {
        this.manager.pushStep(this.capsule, {
            type: 'clear'
        });
        return this;
    },

    _wait() {
        this.manager.newStep();
        return this;
    },

    processStep(step, options) {
        const {
            type,
            args
        } = step;

        switch (type) {
            case 'setData':
                this.setData(...fromJSON(args));
                break;
            case 'clear':
                this.clear();
                break;
        }
    },

    setName(name) {
        let $name;
        if (this.isNew) {
            $name = $('<span class="name">');
            this.$container.append($name);
        } else {
            $name = this.$container.find('span.name');
        }
        $name.text(name || this.defaultName);
    },

    setData() {
        const data = toJSON(arguments);
        if (!this.isNew && this.lastData === data) {
            return true;
        }
        this.isNew = this.capsule.isNew = false;
        this.lastData = this.capsule.lastData = data;
        return false;
    },

    resize() {},
    refresh() {},
    clear() {},

    attach(tracer) {
        if (tracer.module === LogTracer) {
            this.logTracer = tracer;
        }
        return this;
    },

    mousedown(e) {},
    mousemove(e) {},
    mouseup(e) {},
    mousewheel(e) {}
};

module.exports = Tracer;