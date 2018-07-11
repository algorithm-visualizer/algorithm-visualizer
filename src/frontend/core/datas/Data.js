class Data {
  constructor() {
    this.init();
    this.reset();
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
  }

  delay() {
  }
}

export default Data;