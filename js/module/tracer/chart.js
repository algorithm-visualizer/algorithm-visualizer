'use strict';

const Tracer = require('./tracer');

class ChartTracer extends Tracer {
  static getClassName() {
    return 'ChartTracer';
  }

  constructor(name) {
    super(name);

    this.color = {
      selected: 'rgba(255, 0, 0, 1)',
      notified: 'rgba(0, 0, 255, 1)',
      default: 'rgba(136, 136, 136, 1)'
    };

    if (this.isNew) initView(this);
  }

  setData(C) {
    if (super.setData.apply(this, arguments)) {
      this.chart.config.data.datasets[0].data = C;
      this.chart.update();
      return true;
    }

    var color = [];
    for (var i = 0; i < C.length; i++) color.push(this.color.default);
    this.chart.config.data = {
      labels: C.map(String),
      datasets: [{
        backgroundColor: color,
        data: C
      }]
    };
    this.chart.update();
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
      case 'select':
      case 'deselect':
        let color = step.type == 'notify' ? this.color.notified : step.type == 'select' ? this.color.selected : this.color.default;
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

  resize() {
    super.resize();

    this.chart.resize();
  }

  clear() {
    super.clear();

    const data = this.chart.config.data;
    if (data.datasets.length) {
      const backgroundColor = data.datasets[0].backgroundColor;
      for (let i = 0; i < backgroundColor.length; i++) {
        backgroundColor[i] = this.color.default;
      }
      this.chart.update();
    }
  }
}

const initView = (tracer) => {
  tracer.$wrapper = tracer.capsule.$wrapper = $('<canvas class="mchrt-chart">');
  tracer.$container.append(tracer.$wrapper);
  tracer.chart = tracer.capsule.chart = new Chart(tracer.$wrapper, {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
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
      legend: false,
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

module.exports = ChartTracer;
