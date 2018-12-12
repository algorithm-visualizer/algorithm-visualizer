import fs from 'fs-extra';

class File {
  constructor(path, name) {
    this.path = path;
    this.name = name;
    this.refresh();
  }

  refresh() {
    this.content = fs.readFileSync(this.path, 'utf-8');
    this.contributors = [];
  }

  toJSON() {
    const { name, content, contributors } = this;
    return { name, content, contributors };
  }
}

export default File;
