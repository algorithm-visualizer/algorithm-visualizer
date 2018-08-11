import { Data } from '/core/datas';
import { LogRenderer } from '/core/renderers';

class LogData extends Data {
  getRendererClass() {
    return LogRenderer;
  }

  set(messages = []) {
    this.messages = messages;
    super.set();
  }

  print(message) {
    this.messages.push(message);
  }
}

export default LogData;
