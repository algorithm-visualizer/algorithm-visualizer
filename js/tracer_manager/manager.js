'use strict';

const TopMenu = require('../dom/top_menu');

const stepLimit = 1e6;

const TracerManager = function () {
  this.timer = null;
  this.pause = false;
  this.capsules = [];
  this.interval = 500;
};

TracerManager.prototype = {

  add(tracer) {

    const $container = $('<section class="module_wrapper">');
    $('.module_container').append($container);

    const capsule = {
      module: tracer.module,
      tracer,
      allocated: true,
      defaultName: null,
      $container,
      isNew: true
    };

    this.capsules.push(capsule);
    return capsule;
  },

  allocate(newTracer) {
    let selectedCapsule = null;
    let count = 0;

    $.each(this.capsules, (i, capsule) => {
      if (capsule.module === newTracer.module) {
        count++;
        if (!capsule.allocated) {
          capsule.tracer = newTracer;
          capsule.allocated = true;
          capsule.isNew = false;
          selectedCapsule = capsule;
          return false;
        }
      }
    });

    if (selectedCapsule === null) {
      count++;
      selectedCapsule = this.add(newTracer);
    }

    const className = newTracer.module.getClassName();
    selectedCapsule.defaultName = `${className} ${count}`;
    selectedCapsule.order = this.order++;
    return selectedCapsule;
  },

  deallocateAll() {
    this.order = 0;
    this.reset();
    $.each(this.capsules, (i, capsule) => {
      capsule.allocated = false;
    });
  },

  removeUnallocated() {
    let changed = false;

    this.capsules = $.grep(this.capsules, (capsule) => {
      let removed = !capsule.allocated;

      if (capsule.isNew || removed) {
        changed = true;
      }
      if (removed) {
        capsule.$container.remove();
      }

      return !removed;
    });

    if (changed) {
      this.place();
    }
  },

  place() {
    const {
      capsules
    } = this;

    $.each(capsules, (i, capsule) => {
      let width = 100;
      let height = (100 / capsules.length);
      let top = height * capsule.order;

      capsule.$container.css({
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`
      });

      capsule.tracer.resize();
    });
  },

  resize() {
    this.command('resize');
  },

  isPause() {
    return this.pause;
  },

  setInterval(interval) {
    $('#interval').val(interval);
  },

  reset() {
    this.traces = [];
    this.traceIndex = -1;
    this.stepCnt = 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.command('clear');
  },

  pushStep(capsule, step) {
    if (this.stepCnt++ > stepLimit) throw "Tracer's stack overflow";
    let len = this.traces.length;
    let last = [];
    if (len === 0) {
      this.traces.push(last);
    } else {
      last = this.traces[len - 1];
    }
    last.push($.extend(step, {
      capsule
    }));
  },

  newStep() {
    this.traces.push([]);
  },

  pauseStep() {
    if (this.traceIndex < 0) return;
    this.pause = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    $('#btn_pause').addClass('active');
  },

  resumeStep() {
    this.pause = false;
    this.step(this.traceIndex + 1);
    $('#btn_pause').removeClass('active');
  },

  step(i, options = {}) {
    const tracer = this;

    if (isNaN(i) || i >= this.traces.length || i < 0) return;

    this.traceIndex = i;
    const trace = this.traces[i];
    trace.forEach((step) => {
      step.capsule.tracer.processStep(step, options);
    });

    if (!options.virtual) {
      this.command('refresh');
    }

    if (this.pause) return;

    this.timer = setTimeout(() => {
      if (!tracer.nextStep(options)) {
        TopMenu.resetTopMenuButtons();
      }
    }, this.interval);
  },

  prevStep(options = {}) {
    this.command('clear');

    const finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
      this.traceIndex = -1;
      this.command('refresh');
      return false;
    }

    for (let i = 0; i < finalIndex; i++) {
      this.step(i, $.extend(options, {
        virtual: true
      }));
    }

    this.step(finalIndex);
    return true;
  },

  nextStep(options = {}) {
    const finalIndex = this.traceIndex + 1;
    if (finalIndex >= this.traces.length) {
      this.traceIndex = this.traces.length - 1;
      return false;
    }

    this.step(finalIndex, options);
    return true;
  },

  visualize() {
    this.traceIndex = -1;
    this.resumeStep();
  },

  command(...args) {
    const functionName = args.shift();
    $.each(this.capsules, (i, capsule) => {
      if (capsule.allocated) {
        capsule.tracer.module.prototype[functionName].apply(capsule.tracer, args);
      }
    });
  },

  findOwner(container) {
    let selectedCapsule = null;
    $.each(this.capsules, (i, capsule) => {
      if (capsule.$container[0] === container) {
        selectedCapsule = capsule;
        return false;
      }
    });
    return selectedCapsule.tracer;
  }
};

module.exports = TracerManager;
