function ChartTracer() {
    if (Tracer.apply(this, arguments)) {
        ChartTracer.prototype.init.call(this, arguments);
        return true;
    }
    return false;
}

ChartTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
    constructor: ChartTracer,
    init: function () {
        var tracer = this;
        this.$wrapper = this.capsule.$wrapper = $('<canvas id="chart">');
        this.$container.append(this.$wrapper);
        var args = Array.prototype.slice.call(arguments).shift();
        this.c = this.capsule.s = new Chart(this.$wrapper, args[1]);
        this.chart = this.capsule.chart = this.c.chart;
    }
});
