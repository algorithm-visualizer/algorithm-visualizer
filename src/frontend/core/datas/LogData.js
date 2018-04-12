import { Data } from '/core/datas';

class LogData extends Data {
  set(messages = []) {
    this.messages = messages;
    super.set();
  }

  print(message) {
    this.messages.push(message);
    this.render();
  }
}

export default LogData;