import { sprintf } from 'sprintf-js';
import { Data } from '/core/datas';
import { LogRenderer } from '/core/renderers';

class LogData extends Data {
  getRendererClass() {
    return LogRenderer;
  }

  set(log = '') {
    this.log = log;
    super.set();
  }

  print(message) {
    this.log += message;
  }

  println(message) {
    this.print(message + '\n');
  }

  printf(format, ...args) {
    this.print(sprintf(format, ...args));
  }
}

export default LogData;
