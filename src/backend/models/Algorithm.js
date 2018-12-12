import path from 'path';
import { createKey, getDescription, listFiles } from '/common/util';
import { File } from '/models';

class Algorithm {
  constructor(path, name) {
    this.path = path;
    this.key = createKey(name);
    this.name = name;
    this.refresh();
  }

  refresh() {
    this.files = listFiles(this.path)
      .map(fileName => new File(path.resolve(this.path, fileName), fileName));
    this.description = getDescription(this.files);
  }

  toJSON() {
    const { key, name } = this;
    return { key, name };
  }
}

export default Algorithm;
