const Tracer = require('./tracer');

class ChartTracer extends Tracer {
  static getClassName() {
    return 'ChartTracer';
  }

  constructor(name) {
    super(name);

    if (this.isNew) initView(this);
  }

  setData(C) {
    if (super.setData.apply(this, arguments)) return true;

    if (this.chart) this.chart.destroy();
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
              beginAtZero: true
            }
          }]
        },
        animation: false,
        legend: false
      }
    };
    this.chart = this.capsule.chart = new Chart(this.$wrapper, data);
  }

  _notify(s, v) {
    this.manager.pushStep(this.capsule, {
      type: 'notify',
      s: s,
      v: v
    });
    return this;
  }

  _denotify(s) {
    this.manager.pushStep(this.capsule, {
      type: 'denotify',
      s: s
    });
    return this;
  }

  _select(s, e) {
    this.manager.pushStep(this.capsule, {
      type: 'select',
      s: s,
      e: e
    });
    return this;
  }

  _deselect(s, e) {
    this.manager.pushStep(this.capsule, {
      type: 'deselect',
      s: s,
      e: e
    });
    return this;
  }

  processStep(step, options) {
    switch (step.type) {
      case 'notify':
        if (step.v !== undefined) {
          this.chart.config.data.datasets[0].data[step.s] = step.v;
          this.chart.config.data.labels[step.s] = step.v.toString();
        }
      case 'denotify':
      case 'deselect':
        var color = step.type == 'denotify' || step.type == 'deselect' ? 'rgba(136, 136, 136, 1)' : 'rgba(255, 0, 0, 1)';
      case 'select':
        if (color === undefined) var color = 'rgba(0, 0, 255, 1)';
        if (step.e !== undefined)
          for (var i = step.s; i <= step.e; i++)
            this.chart.config.data.datasets[0].backgroundColor[i] = color;
        else
          this.chart.config.data.datasets[0].backgroundColor[step.s] = color;
        this.chart.update();
        break;
      default:
        super.processStep(step, options);
    }
  }
}

const initView = (tracer) => {
  tracer.$wrapper = tracer.capsule.$wrapper = $('<canvas class="mchrt-chart">');
  tracer.$container.append(tracer.$wrapper);
};

module.exports = ChartTracer;