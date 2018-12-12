import path from 'path';
import { createKey, listDirectories } from '/common/util';
import { Algorithm } from '/models';

class Category {
  constructor(path, name) {
    this.path = path;
    this.key = createKey(name);
    this.name = name;
    this.refresh();
  }

  refresh() {
    this.algorithms = listDirectories(this.path)
      .map(algorithmName => new Algorithm(path.resolve(this.path, algorithmName), algorithmName));
  }

  toJSON() {
    const { key, name, algorithms } = this;
    return { key, name, algorithms };
  }
}

export default Category;
