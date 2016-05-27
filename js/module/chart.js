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
        this.$wrapper = this.capsule.$wrapper = $('<canvas id="chart">');
        this.$container.append(this.$wrapper);
    },
    setData: function (C) {
        if (Tracer.prototype.setData.apply(this, arguments)) return true;
        var tracer = this;
        var color = [];
        for (var i = 0; i < C.length; i++) color.push('rgba(136, 136, 136, 1)');
        var data = {
            type: 'bar',
            data: {
                labels: C.map(String),
                datasets: [{
                    backgroundColor: color,
                    data: C
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        };
        this.chart = this.capsule.chart = new Chart(this.$wrapper, data);
    },
    _notify: function (s, v) {
        this.manager.pushStep(this.capsule, { type: 'notify', s: s, v: v });
        return this;
    },
    _denotify: function (s) {
        this.manager.pushStep(this.capsule, { type: 'denotify', s: s });
        return this;
    },
    _select: function (s, e) {
        this.manager.pushStep(this.capsule, { type: 'select', s: s, e: e });
        return this;
    },
    _deselect: function (s, e) {
        this.manager.pushStep(this.capsule, { type: 'deselect', s: s, e: e });
        return this;
    },
    processStep: function (step, options) {
        switch (step.type) {
            case 'notify':
                if (step.v) {
                    this.chart.config.data.datasets[0].data[step.s] = step.v;
                    this.chart.config.data.labels[step.s] = step.v.toString();
                }
            case 'denotify':
            case 'deselect':
                var color = step.type == 'denotify' || step.type == 'deselect' ? 'rgba(136, 136, 136, 1)' : 'rgba(255, 0, 0, 1)';
            case 'select':
                if(color === undefined) var color = 'rgba(0, 0, 255, 1)';
                if(step.e !== undefined)
                    for (var i = step.s; i <= step.e; i++) 
                        this.chart.config.data.datasets[0].backgroundColor[i] = color;
                else 
                    this.chart.config.data.datasets[0].backgroundColor[step.s] = color;
                this.chart.update();
                break;
            default:
                Tracer.prototype.processStep.call(this, step, options);
        }
    },
});
