var timer = null;
var stepLimit = 1e6;

var TracerManager = function () {
    this.pause = false;
    this.capsules = [];
    this.interval = 500;
};

TracerManager.prototype = {
    add: function (tracer) {
        var $container = $('<section class="module_wrapper">');
        $module_container.append($container);
        var capsule = {
            module: tracer.module,
            tracer: tracer,
            allocated: true,
            $container: $container,
            new: true
        };
        this.capsules.push(capsule);
        return capsule;
    },
    allocate: function (newTracer) {
        var selectedCapsule = null;
        $.each(this.capsules, function (i, capsule) {
            if (!capsule.allocated && capsule.module == newTracer.module) {
                capsule.tracer = newTracer;
                capsule.allocated = true;
                capsule.new = false;
                selectedCapsule = capsule;
                return false;
            }
        });
        if (selectedCapsule == null) {
            selectedCapsule = this.add(newTracer);
        }
        return selectedCapsule;
    },
    deallocateAll: function () {
        this.reset();
        $.each(this.capsules, function (i, capsule) {
            capsule.allocated = false;
        });
    },
    removeUnallocated: function () {
        var changed = false;
        this.capsules = $.grep(this.capsules, function (capsule) {
            var removed = !capsule.allocated;
            if (capsule.new || removed) changed = true;
            if (removed) {
                capsule.$container.remove();
            }
            return !removed;
        });
        if (changed) this.place();
    },
    place: function () {
        var capsules = this.capsules;
        $.each(capsules, function (i, capsule) {
            var width = $module_container.width();
            var height = $module_container.height() / capsules.length;
            var top = height * i;
            capsule.$container.css({
                top: top,
                width: width,
                height: height
            });
            capsule.tracer.resize();
        });
    },
    resize: function () {
        this.command('resize');
    },
    isPause: function () {
        return this.pause;
    },
    setInterval: function (interval) {
        $('#btn_interval input').val(interval);
    },
    reset: function () {
        this.traces = [];
        this.traceIndex = -1;
        this.stepCnt = 0;
        if (timer) clearTimeout(timer);
        this.command('clear');
    },
    pushStep: function (capsule, step) {
        if (this.stepCnt++ > stepLimit) throw "Tracer's stack overflow";
        var len = this.traces.length;
        var last = [];
        if (len == 0) {
            this.traces.push(last);
        } else {
            last = this.traces[len - 1];
        }
        last.push($.extend(step, {capsule: capsule}));
    },
    newStep: function () {
        this.traces.push([]);
    },
    pauseStep: function () {
        if (this.traceIndex < 0) return;
        this.pause = true;
        if (timer) clearTimeout(timer);
        $('#btn_pause').addClass('active');
    },
    resumeStep: function () {
        this.pause = false;
        this.step(this.traceIndex + 1);
        $('#btn_pause').removeClass('active');
    },
    step: function (i, options) {
        var tracer = this;

        if (isNaN(i) || i >= this.traces.length || i < 0) return;
        options = options || {};

        this.traceIndex = i;
        var trace = this.traces[i];
        trace.forEach(function (step) {
            step.capsule.tracer.processStep(step, options);
        });
        if (!options.virtual) {
            this.command('refresh');
        }
        if (this.pause) return;
        timer = setTimeout(function () {
            tracer.step(i + 1, options);
        }, this.interval);
    },
    prevStep: function () {
        this.command('clear');
        var finalIndex = this.traceIndex - 1;
        if (finalIndex < 0) {
            this.traceIndex = -1;
            this.command('refresh');
            return;
        }
        for (var i = 0; i < finalIndex; i++) {
            this.step(i, {virtual: true});
        }
        this.step(finalIndex);
    },
    nextStep: function () {
        this.step(this.traceIndex + 1);
    },
    visualize: function () {
        $('#btn_trace').click();
        this.traceIndex = -1;
        this.resumeStep();
    },
    command: function () {
        var args = Array.prototype.slice.call(arguments);

        var functionName = args.shift();
        $.each(this.capsules, function (i, capsule) {
            if (capsule.allocated) {
                capsule.tracer.module.prototype[functionName].apply(capsule.tracer, args);
            }
        });
    },
    findOwner: function (container) {
        var selectedCapsule = null;
        $.each(this.capsules, function (i, capsule) {
            if (capsule.$container[0] == container) {
                selectedCapsule = capsule;
                return false;
            }
        });
        return selectedCapsule.tracer;
    }
};