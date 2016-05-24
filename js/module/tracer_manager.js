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
            var width = $module_container.width() / capsules.length;
            var height = $module_container.height();
            var left = width * i;
            capsule.$container.css({
                top: 0,
                left: left,
                width: width,
                height: height
            });
            capsule.tracer.resize();
        });
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
    isPause: function () {
        return this.pause;
    },
    setInterval: function (interval) {
        $('#btn_interval input').val(interval);
    }
};