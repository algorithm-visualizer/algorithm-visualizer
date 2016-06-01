const Array2DTracer = require('./array2d');

function Array1DTracer() {
  return Array2DTracer.apply(this, arguments);
}

Array1DTracer.prototype = $.extend(true, Object.create(Array2DTracer.prototype), {
  constructor: Array1DTracer,
  name: "Array1DTracer",
  _notify: function (idx, v) {
    Array2DTracer.prototype._notify.call(this, 0, idx, v);
    return this;
  },
  _denotify: function (idx) {
    Array2DTracer.prototype._denotify.call(this, 0, idx);
    return this;
  },
  _select: function (s, e) {
    if (e === undefined) {
      Array2DTracer.prototype._select.call(this, 0, s);
    } else {
      Array2DTracer.prototype._selectRow.call(this, 0, s, e);
    }
    return this;
  },
  _deselect: function (s, e) {
    if (e === undefined) {
      Array2DTracer.prototype._deselect.call(this, 0, s);
    } else {
      Array2DTracer.prototype._deselectRow.call(this, 0, s, e);
    }
    return this;
  },
  setData: function (D) {
    return Array2DTracer.prototype.setData.call(this, [D]);
  }
});

module.exports = Array1DTracer;