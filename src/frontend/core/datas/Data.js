class Data {
  constructor(options) {
    this.options = {
      ...this.getDefaultOptions(),
      ...options,
    };
    this.init();
    this.reset();
  }

  getDefaultOptions() {
    return {};
  }

  init() {
  }

  setOnRender(onRender) {
    this.onRender = onRender;
    this.render();
  }

  render() {
    if (this.onRender) this.onRender();
  }

  reset() {
    this.set();
  }

  set() {
    this.render();
  }

  wait() {
  }
}

export default Data;